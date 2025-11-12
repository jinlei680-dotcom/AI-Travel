"use client";
import React, { useEffect, useRef, useState } from "react";

type VoiceButtonProps = {
  onTranscribe?: (text: string) => void;
  // 新增：实时片段更新回调，用于把中间结果同步到外部输入框
  onPartial?: (text: string) => void;
  className?: string;
};

type State = "idle" | "recording" | "transcribing" | "done" | "error";

export default function VoiceButton({ onTranscribe, onPartial, className = "" }: VoiceButtonProps) {
  console.log("[VoiceButton] render");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string>("");
  const [mode] = useState<"service" | "iflytek" | "browser">("iflytek");
  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const textRef = useRef<string>("");
  const tokensRef = useRef<string[]>([]); // 累积识别词元，支持 wpgs 动态修正
  const showMessageRef = useRef<boolean>(false); // 控制右侧提示是否显示（录音过程中禁用）
  const browserRecogRef = useRef<any>(null); // 浏览器识别对象引用，便于停止
  const fallbackTriedRef = useRef<boolean>(false); // 防重复回退

  // 将 Float32 PCM 转为 16bit PCM 并 base64
  const floatTo16kBase64 = (input: Float32Array, inputSampleRate: number, targetRate = 16000) => {
    let samples = input;
    if (inputSampleRate !== targetRate) {
      const ratio = inputSampleRate / targetRate;
      const newLength = Math.round(input.length / ratio);
      const resampled = new Float32Array(newLength);
      for (let i = 0; i < newLength; i++) {
        const idx = Math.round(i * ratio);
        resampled[i] = input[Math.min(idx, input.length - 1)];
      }
      samples = resampled;
    }
    const buffer = new ArrayBuffer(samples.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < samples.length; i++) {
      let s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    const u8 = new Uint8Array(buffer);
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < u8.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, Array.from(u8.subarray(i, i + chunkSize)) as any);
    }
    return btoa(binary);
  };

  const parseIatText = (msg: any) => {
    try {
      const ws = msg?.data?.result?.ws || [];
      const parts: string[] = [];
      for (const w of ws) {
        const cw = w?.cw || [];
        if (cw[0]?.w) parts.push(cw[0].w);
      }
      return parts.join("");
    } catch {
      return "";
    }
  };

  const startIflytek = async () => {
    try {
      console.log("[VoiceButton] startIflytek: fetching sign...");
      setMessage("请求讯飞签名...");
      const signRes = await fetch("/api/voice/iflytek/sign");
      console.log("[VoiceButton] sign response status:", signRes.status);
      if (signRes.status !== 200) {
        setState("error");
        setMessage("讯飞签名失败或未配置，回退到浏览器识别");
        if (!fallbackTriedRef.current) { fallbackTriedRef.current = true; startBrowserSpeech(); }
        return;
      }
      const { wsUrl, appId } = await signRes.json();
      console.log("[VoiceButton] sign ok. appId:", appId);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      // 使用默认设备采样率，避免部分浏览器不支持强制 16000 采样率
      const AC: any = (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AC();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      console.log("[VoiceButton] opening websocket:", wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      textRef.current = "";
      setState("recording");
      setMessage("录音中（讯飞）...");

      ws.onopen = () => {
        // 发送开始帧
        const startFrame = {
          common: { app_id: appId },
          business: {
            language: "zh_cn",
            domain: "iat",
            accent: "mandarin",
            // 启用动态修正以便实时返回片段
            dwa: "wpgs",
            vad_eos: 5000,
          },
          data: {
            status: 0,
            format: "audio/L16;rate=16000",
            encoding: "raw",
            audio: "",
          },
        };
        ws.send(JSON.stringify(startFrame));

        processor.onaudioprocess = (e: AudioProcessingEvent) => {
          const input = e.inputBuffer.getChannelData(0);
          const base64 = floatTo16kBase64(input, audioCtx.sampleRate, 16000);
          const frame = {
            data: {
              status: 1,
              format: "audio/L16;rate=16000",
              encoding: "raw",
              audio: base64,
            },
          };
          ws.send(JSON.stringify(frame));
        };
        source.connect(processor);
        processor.connect(audioCtx.destination);
        tokensRef.current = [];
      };

      ws.onmessage = async (ev: MessageEvent) => {
        try {
          let data: any;
          if (typeof ev.data === "string") {
            data = JSON.parse(ev.data);
          } else if (ev.data instanceof Blob) {
            data = JSON.parse(await ev.data.text());
          } else if (ev.data instanceof ArrayBuffer) {
            data = JSON.parse(new TextDecoder().decode(ev.data));
          } else {
            data = ev.data;
          }
          if (data.code !== 0) {
            setState("error");
            setMessage(data.message || "讯飞识别错误");
            return;
          }
          const status = data?.data?.status;
          const result = data?.data?.result || {};
          const wsArr = result.ws || [];
          const pgs = result.pgs; // 'apd' 追加 或 'rpl' 替换
          const rg = result.rg || []; // [start, end] 1-based

          const words: string[] = [];
          for (const w of wsArr) {
            const cw = w?.cw || [];
            if (cw[0]?.w) words.push(cw[0].w);
          }

          if (words.length) {
            if (pgs === "rpl" && Array.isArray(rg) && rg.length === 2) {
              const start = Math.max(0, Number(rg[0]) - 1);
              const end = Math.min(tokensRef.current.length, Number(rg[1]));
              tokensRef.current.splice(start, end - start, ...words);
            } else {
              tokensRef.current.push(...words);
            }

            const full = tokensRef.current.join("");
            if (showMessageRef.current) setMessage(full);
            textRef.current = full;
            // 将中间结果回调到外部，便于实时展示
            try { onPartial?.(full); } catch {}

            if (status === 2) {
              setState("done");
              onTranscribe?.(full);
              setMessage("");
              try { ws.close(); } catch {}
            }
          }
        } catch (e: any) {
          setState("error");
          setMessage(e?.message || "讯飞消息解析失败");
        }
      };

      ws.onerror = () => {
        console.error("[VoiceButton] websocket error");
        // 连接失败时提示并保持错误状态，不回退，以确保使用讯飞方案
        try {
          source.disconnect();
          processor.disconnect();
          if (audioCtx.state !== "closed") audioCtx.close();
          stream.getTracks().forEach(t => t.stop());
        } catch {}
        setState("error");
        setMessage("讯飞连接错误，回退到浏览器识别");
        if (!fallbackTriedRef.current) { fallbackTriedRef.current = true; startBrowserSpeech(); }
      };

      ws.onclose = (ev: CloseEvent) => {
        if (textRef.current) {
          setState("done");
          onTranscribe?.(textRef.current);
        } else if (state === "recording") {
          // 若正在录音被关闭，则恢复为空闲
          setState("idle");
          setMessage("已停止");
        }
        // 清理资源
        try {
          source.disconnect();
          processor.disconnect();
          if (audioCtx.state !== "closed") audioCtx.close();
          stream.getTracks().forEach(t => t.stop());
        } catch {}
      };
    } catch (e: any) {
      setState("error");
      console.error("[VoiceButton] startIflytek error:", e);
      setMessage(e?.message || "讯飞启动失败，回退到浏览器识别");
      if (!fallbackTriedRef.current) { fallbackTriedRef.current = true; startBrowserSpeech(); }
    }
  };

  // 浏览器语音识别回退
  const startBrowserSpeech = () => {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) {
      setState("error");
      setMessage("浏览器不支持 Web Speech API");
      return;
    }
    const recog = new SR();
    browserRecogRef.current = recog;
    recog.lang = "zh-CN";
    // 浏览器回退时也尽量开启连续识别与中间结果
    recog.continuous = true;
    recog.interimResults = true;
    setState("recording");
    recog.onresult = (ev: any) => {
      try {
        const parts: string[] = [];
        for (let i = 0; i < ev.results.length; i++) {
          const r = ev.results[i];
          const t = r?.[0]?.transcript || "";
          if (t) parts.push(t);
        }
        const text = parts.join(" ");
        setMessage(text);
        onPartial?.(text);
        // 在结束事件中会再次触发最终 onTranscribe
      } catch {}
    };
    recog.onerror = (e: any) => {
      setState("error");
      setMessage(e?.message || "识别失败");
    };
    recog.onend = () => {
      if (state === "recording") setState("idle");
    };
    recog.start();
  };

  const startRecording = async () => {
    console.log("[VoiceButton] click: startRecording");
    showMessageRef.current = false; // 录音过程中不显示右侧提示
    setMessage("");
    await startIflytek();
  };

  const stopRecording = () => {
    // 停止浏览器识别（如处于回退模式）
    try { browserRecogRef.current?.stop?.(); } catch {}
    browserRecogRef.current = null;
    // 发送结束帧（若连接已打开）
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ data: { status: 2, format: "audio/L16;rate=16000", encoding: "raw", audio: "" } })
        );
      }
    } catch {}

    // 停止音频处理与关闭连接
    try { if (processorRef.current) { (processorRef.current as any).onaudioprocess = null; processorRef.current.disconnect(); } } catch {}
    try { if (audioCtxRef.current && audioCtxRef.current.state !== "closed") { audioCtxRef.current.close(); } } catch {}
    // 允许服务端返回最终结果，再延迟关闭 WebSocket
    try {
      if (wsRef.current) {
        const ws = wsRef.current;
        setTimeout(() => { try { if (ws.readyState === WebSocket.OPEN) ws.close(); } catch {} }, 800);
      }
    } catch {}

    processorRef.current = null;
    audioCtxRef.current = null;
    wsRef.current = null;

    // 停止麦克风流
    try { streamRef.current?.getTracks().forEach((t) => t.stop()); } catch {}
    streamRef.current = null;

    // 切为“转写中”，清空并停止显示右侧提示
    setState("transcribing");
    showMessageRef.current = false;
    setMessage("");
  };

  useEffect(() => () => stopRecording(), []);

  useEffect(() => {
    console.log("[VoiceButton] mounted");
    return () => console.log("[VoiceButton] unmounted");
  }, []);

  return (
    <div
      className={["flex items-center gap-2", className].join(" ")}
      onClickCapture={() => console.log("[VoiceButton] container onClickCapture")}
      onMouseDown={() => console.log("[VoiceButton] container onMouseDown")}
    >
      <button
        type="button"
        className="rounded bg-black px-3 py-1.5 text-white disabled:opacity-60"
        aria-label="语音输入"
        data-voice-button
        onClick={state === "recording" ? stopRecording : startRecording}
      >
        {state === "recording" ? "停止" : "语音输入"}
      </button>
      {/* 固定使用讯飞识别，不展示模式选择 */}
      {/* 不再显示右侧提示 */}
    </div>
  );
}

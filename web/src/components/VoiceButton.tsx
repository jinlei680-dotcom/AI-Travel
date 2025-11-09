"use client";
import React, { useEffect, useRef, useState } from "react";

type VoiceButtonProps = {
  onTranscribe?: (text: string) => void;
  className?: string;
};

type State = "idle" | "recording" | "transcribing" | "done" | "error";

export default function VoiceButton({ onTranscribe, className = "" }: VoiceButtonProps) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string>("");
  const [mode, setMode] = useState<"service" | "iflytek" | "browser">("service");
  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const textRef = useRef<string>("");

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
      const signRes = await fetch("/api/voice/iflytek/sign");
      if (signRes.status === 501) {
        setMessage("未配置讯飞密钥，回退浏览器识别");
        startBrowserSpeech();
        return;
      }
      const { wsUrl, appId } = await signRes.json();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

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

        processor.onaudioprocess = (e) => {
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
      };

      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (data.code !== 0) {
            setState("error");
            setMessage(data.message || "讯飞识别错误");
            return;
          }
          const text = parseIatText(data);
          if (text) {
            textRef.current += text;
            setMessage(textRef.current);
          }
        } catch (e: any) {
          setState("error");
          setMessage(e?.message || "讯飞消息解析失败");
        }
      };

      ws.onerror = () => {
        setState("error");
        setMessage("讯飞连接错误");
      };

      ws.onclose = () => {
        if (textRef.current) {
          setState("done");
          onTranscribe?.(textRef.current);
        } else if (state === "recording") {
          setState("idle");
        }
      };
    } catch (e: any) {
      setState("error");
      setMessage(e?.message || "讯飞启动失败");
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
    recog.lang = "zh-CN";
    recog.continuous = false;
    recog.interimResults = false;
    setState("recording");
    recog.onresult = (ev: any) => {
      const text = ev.results?.[0]?.[0]?.transcript || "";
      setState("done");
      setMessage(text);
      onTranscribe?.(text);
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
    if (mode === "browser") {
      startBrowserSpeech();
      return;
    }
    if (mode === "iflytek") {
      await startIflytek();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const rec = new MediaRecorder(stream, { mimeType: "audio/webm" });
      recRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setState("transcribing");
        setMessage("正在转写...");
        try {
          const res = await fetch("/api/voice/transcribe", {
            method: "POST",
            headers: { "content-type": blob.type },
            body: blob,
          });
          if (res.status === 501) {
            // provider 未配置，回退到浏览器识别
            startBrowserSpeech();
            return;
          }
          if (!res.ok) throw new Error("转写接口错误");
          const data = await res.json();
          const text = data?.text || "";
          setState("done");
          setMessage(text);
          onTranscribe?.(text);
        } catch (e: any) {
          setState("error");
          setMessage(e?.message || "上传或识别失败");
        }
      };
      rec.start();
      setState("recording");
      setMessage("录音中...");
    } catch (e: any) {
      setState("error");
      setMessage(e?.message || "无法获取麦克风权限");
    }
  };

  const stopRecording = () => {
    if (mode === "iflytek") {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(
            JSON.stringify({ data: { status: 2, format: "audio/L16;rate=16000", encoding: "raw", audio: "" } })
          );
        } catch {}
      }
      processorRef.current?.disconnect();
      audioCtxRef.current?.close();
      wsRef.current?.close();
      processorRef.current = null;
      audioCtxRef.current = null;
      wsRef.current = null;
    } else {
      if (recRef.current && state === "recording") {
        recRef.current.stop();
      }
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  useEffect(() => () => stopRecording(), []);

  return (
    <div className={["flex items-center gap-2", className].join(" ")}>
      <button
        className="rounded bg-black px-3 py-1.5 text-white disabled:opacity-60"
        onClick={state === "recording" ? stopRecording : startRecording}
      >
        {state === "recording" ? "停止" : "语音输入"}
      </button>
      <select
        className="rounded border px-2 py-1 text-sm"
        value={mode}
        onChange={(e) => setMode(e.target.value as any)}
        title="选择识别方式"
      >
        <option value="service">服务端识别</option>
        <option value="iflytek">讯飞识别（WebSocket）</option>
        <option value="browser">浏览器回退</option>
      </select>
      <span className="text-xs text-zinc-500">{message}</span>
    </div>
  );
}
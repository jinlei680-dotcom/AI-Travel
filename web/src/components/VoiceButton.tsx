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
  const [mode, setMode] = useState<"service" | "browser">("service");
  const streamRef = useRef<MediaStream | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

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
    if (recRef.current && state === "recording") {
      recRef.current.stop();
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
        <option value="browser">浏览器回退</option>
      </select>
      <span className="text-xs text-zinc-500">{message}</span>
    </div>
  );
}
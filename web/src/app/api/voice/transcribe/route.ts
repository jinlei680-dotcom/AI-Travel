export const runtime = "nodejs";

import ffmpegPath from "ffmpeg-static";
import { randomUUID } from "crypto";
import { createHash } from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import { spawn } from "child_process";

type TranscribeResult = {
  text: string;
  confidence?: number;
  language?: string;
  provider?: string;
};

async function transcodeToWav16kMono(inputPath: string, outputPath: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const args = [
      "-y",
      "-i",
      inputPath,
      "-ar",
      "16000",
      "-ac",
      "1",
      "-sample_fmt",
      "s16",
      outputPath,
    ];
    const hasStatic = typeof ffmpegPath === "string" && ffmpegPath && fs.existsSync(ffmpegPath as string);
    const bin = hasStatic ? (ffmpegPath as string) : "ffmpeg";
    const ff = spawn(bin, args, { stdio: "inherit" });
    ff.on("error", (err) => reject(err));
    ff.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

function md5Hex(input: string): string {
  return createHash("md5").update(input).digest("hex");
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  // 接收原始音频数据（webm/wav）
  const buf = Buffer.from(await req.arrayBuffer());
  const size = buf.byteLength;

  const appId = process.env.IFLYTEK_APP_ID;
  const apiKey = process.env.IFLYTEK_API_KEY;
  const apiSecret = process.env.IFLYTEK_API_SECRET;

  // 若未配置讯飞密钥，返回 501 以提示前端走浏览器回退方案
  if (!appId || !apiKey || !apiSecret) {
    const resp: TranscribeResult = {
      text: "",
      confidence: 0,
      language: "zh-CN",
      provider: "iflytek",
    };
    return new Response(
      JSON.stringify({ error: "voice provider not configured", fallback: true, size, contentType, result: resp }),
      { status: 501, headers: { "content-type": "application/json" } }
    );
  }

  // 将音频写入临时文件
  const tmpDir = os.tmpdir();
  const id = randomUUID();
  const ext = contentType.includes("webm") ? ".webm" : contentType.includes("wav") ? ".wav" : ".bin";
  const inputPath = path.join(tmpDir, `voice_${id}${ext}`);
  const outputPath = path.join(tmpDir, `voice_${id}_16k_mono.wav`);
  try {
    await fs.promises.writeFile(inputPath, buf);
    // 若已是 wav 格式则直接使用输入；否则尝试转码为 16kHz/mono/16bit WAV
    if (contentType.includes("wav")) {
      await fs.promises.copyFile(inputPath, outputPath);
    } else {
      await transcodeToWav16kMono(inputPath, outputPath);
    }

    const wavBuf = await fs.promises.readFile(outputPath);
    const audioBase64 = wavBuf.toString("base64");

    // 组装 REST IAT 请求
    const curTime = Math.floor(Date.now() / 1000).toString();
    const xParam = Buffer.from(JSON.stringify({ engine_type: "sms16k", aue: "raw" })).toString("base64");
    const checkSum = md5Hex(apiKey + curTime + xParam);

    const resp = await fetch("http://api.xfyun.cn/v1/service/v1/iat", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Appid": appId,
        "X-CurTime": curTime,
        "X-Param": xParam,
        "X-CheckSum": checkSum,
      },
      body: new URLSearchParams({ audio: audioBase64 }).toString(),
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      return new Response(
        JSON.stringify({ error: "iflytek_rest_error", status: resp.status, data }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    // 解析返回文本，不同版本返回结构可能不同，这里做兜底处理
    let text = "";
    if (typeof data === "string") {
      text = data;
    } else if (data && typeof data.data === "string") {
      text = data.data;
    } else if (data && data.data && typeof data.data.result === "string") {
      text = data.data.result;
    } else if (data && data.desc) {
      text = data.desc as string;
    }

    const result: TranscribeResult = {
      text: text || "",
      confidence: 0.8,
      language: "zh-CN",
      provider: "iflytek",
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    const msg = err?.message || String(err);
    const needFfmpeg = msg.includes("ENOENT") || msg.includes("ffmpeg");
    const status = needFfmpeg ? 503 : 500;
    return new Response(
      JSON.stringify({ error: needFfmpeg ? "ffmpeg_missing" : "transcode_or_request_failed", message: msg }),
      { status, headers: { "content-type": "application/json" } }
    );
  } finally {
    // 清理临时文件
    const safeUnlink = async (p: string) => {
      try {
        await fs.promises.unlink(p);
      } catch {}
    };
    await safeUnlink(inputPath);
    await safeUnlink(outputPath);
  }
}

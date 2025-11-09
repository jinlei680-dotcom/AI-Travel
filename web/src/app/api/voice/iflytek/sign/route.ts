import { NextResponse } from "next/server";
import crypto from "crypto";

const HOST = process.env.IFLYTEK_IAT_HOST || "ws-api.xfyun.cn";
const PATH = "/v2/iat";

export async function GET() {
  const appId = process.env.IFLYTEK_APP_ID;
  const apiKey = process.env.IFLYTEK_API_KEY;
  const apiSecret = process.env.IFLYTEK_API_SECRET;
  if (!appId || !apiKey || !apiSecret) {
    return NextResponse.json({ enabled: false, error: "Missing IFLYTEK credentials" }, { status: 501 });
  }

  const date = new Date().toUTCString();
  const signatureOrigin = `host: ${HOST}\n` + `date: ${date}\n` + `GET ${PATH} HTTP/1.1`;
  const signatureSha = crypto.createHmac("sha256", apiSecret).update(signatureOrigin).digest("base64");
  const authorization = `api_key=\"${apiKey}\", algorithm=\"hmac-sha256\", headers=\"host date request-line\", signature=\"${signatureSha}\"`;
  const wsUrl = `wss://${HOST}${PATH}?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(date)}&host=${encodeURIComponent(HOST)}`;

  return NextResponse.json({ enabled: true, wsUrl, appId });
}
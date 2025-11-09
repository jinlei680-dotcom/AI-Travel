export const runtime = "node";

type TranscribeResult = {
  text: string;
  confidence?: number;
  language?: string;
  provider?: string;
};

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";

  // 接收原始音频数据（webm/wav），目前不做实际转写，返回占位结果
  const buf = await req.arrayBuffer();
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
    return new Response(JSON.stringify({ error: "voice provider not configured", fallback: true, size, contentType, result: resp }), { status: 501, headers: { "content-type": "application/json" } });
  }

  // TODO: 集成科大讯飞 REST/WS 转写，这里临时返回占位结果以完成前后端联通
  const result: TranscribeResult = {
    text: "（占位）已收到音频，待集成讯飞转写",
    confidence: 0.5,
    language: "zh-CN",
    provider: "iflytek",
  };
  return new Response(JSON.stringify(result), { status: 200, headers: { "content-type": "application/json" } });
}
import { NextRequest, NextResponse } from 'next/server';

function normalizeCurrency(input: string): string {
  return input
    .replace(/[\s,，]/g, '')
    .replace(/[¥￥元RMB]/gi, '')
    .trim();
}

function detectCategory(text: string): string {
  const t = text.toLowerCase();
  if (/交通|taxi|打车|地铁|bus|火车|飞机/.test(text)) return '交通';
  if (/餐饮|吃|饭|餐|food|drink|酒|咖啡/.test(text)) return '餐饮';
  if (/住宿|hotel|宾馆|民宿|房费/.test(text)) return '住宿';
  if (/门票|ticket|门|景区|博物馆/.test(text)) return '门票';
  if (/购物|buy|shop|纪念品|超市|mall/.test(text)) return '购物';
  if (/活动|play|活动费|娱乐|bar|club|ktv|体验/.test(text)) return '活动';
  return '其他';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text: string = String(body?.text || '');
    if (!text) return NextResponse.json({ error: 'text required' }, { status: 400 });

    // 提取金额：支持“58”“58元”“¥58”“￥58”“58.00”等
    const amountMatch = text.match(/[¥￥]?[\s]*([0-9]+(?:\.[0-9]{1,2})?)/);
    let amount = 0;
    if (amountMatch) {
      amount = Number(normalizeCurrency(amountMatch[0]));
    }

    const category = detectCategory(text);
    const note = text.trim();

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: '无法解析有效金额' }, { status: 400 });
    }

    return NextResponse.json({ amount: Math.round(amount), category, note });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || '解析异常' }, { status: 500 });
  }
}
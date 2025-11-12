import { NextRequest, NextResponse } from 'next/server';
import { parseAmountFromText, detectCategory } from '@/lib/amount';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text: string = String(body?.text || '');
    if (!text) return NextResponse.json({ error: 'text required' }, { status: 400 });

    // 提取金额：支持阿拉伯数字与常见中文金额表达
    const amount = parseAmountFromText(text) || 0;

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

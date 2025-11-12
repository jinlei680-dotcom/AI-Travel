// 解析文本中的金额：支持阿拉伯数字与常见中文金额表达
// 示例："58元"、"¥58"、"二十八元"、"三十七点五"、"两块五"、"一百零二"

const CN_NUM: Record<string, number> = {
  '零': 0, '〇': 0,
  '一': 1, '二': 2, '两': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9
};

function parseCnSection(section: string): number {
  let result = 0;
  let num = 0;
  for (const ch of section) {
    if (CN_NUM.hasOwnProperty(ch)) {
      num = CN_NUM[ch];
    } else if (ch === '千') {
      result += (num || 1) * 1000; num = 0;
    } else if (ch === '百') {
      result += (num || 1) * 100; num = 0;
    } else if (ch === '十') {
      result += (num || 1) * 10; num = 0;
    } else if (ch === '零') {
      // ignore
    }
  }
  result += num;
  return result;
}

function chineseToNumber(raw: string): number | null {
  let s = raw.replace(/[\s,，]/g, '').replace(/[¥￥元块人民币]/g, '').replace(/两/g, '二');
  if (!s) return null;

  // 优先处理小数："三十七点五"、"二十八点三六"
  if (s.includes('点')) {
    const [intPart, fracPart] = s.split('点');
    const intVal = parseCnSection(intPart);
    let fracVal = 0;
    let base = 1;
    for (const ch of fracPart) {
      if (CN_NUM.hasOwnProperty(ch)) {
        base *= 10; // 每个中文数字视为一位小数
        fracVal = fracVal + CN_NUM[ch] / base;
      }
    }
    const total = intVal + fracVal;
    return Number.isFinite(total) && total > 0 ? total : null;
  }

  // 特例："两块五"、"十八块二" → 整数 + 分之一（十分位）
  const mTen = s.match(/^([一二两三四五六七八九十百千]+)[块]?([一二三四五六七八九])$/);
  if (mTen) {
    const intVal = parseCnSection(mTen[1]);
    const fracDigit = CN_NUM[mTen[2]] || 0;
    const total = intVal + fracDigit / 10;
    return Number.isFinite(total) && total > 0 ? total : null;
  }

  // 常规：无小数的中文数词
  // 处理 亿/万 分节
  let total = 0;
  const yiIdx = s.indexOf('亿');
  if (yiIdx !== -1) {
    total += parseCnSection(s.slice(0, yiIdx)) * 1e8;
    s = s.slice(yiIdx + 1);
  }
  const wanIdx = s.indexOf('万');
  if (wanIdx !== -1) {
    total += parseCnSection(s.slice(0, wanIdx)) * 1e4;
    s = s.slice(wanIdx + 1);
  }
  total += parseCnSection(s);
  return Number.isFinite(total) && total > 0 ? total : null;
}

function normalizeCurrency(input: string): string {
  return input.replace(/[\s,，]/g, '').replace(/[¥￥元RMB人民币块]/gi, '').trim();
}

export function parseAmountFromText(text: string): number | null {
  const t = String(text || '').trim();
  if (!t) return null;
  // 先尝试阿拉伯数字
  const m = t.match(/[¥￥]?[\s]*([0-9]+(?:\.[0-9]{1,2})?)/);
  if (m) {
    const n = Number(normalizeCurrency(m[0]));
    if (Number.isFinite(n) && n > 0) return n;
  }
  // 尝试中文数字
  const cnMatch = t.match(/[零〇一二两三四五六七八九十百千万亿点]+/);
  if (cnMatch) {
    const n = chineseToNumber(cnMatch[0]);
    if (Number.isFinite(n!) && (n as number) > 0) return n as number;
  }
  return null;
}

export function detectCategory(text: string): string {
  const full = String(text || '');
  const t = full.toLowerCase();
  if (/交通|taxi|打车|地铁|bus|巴士|火车|飞机|航班|高铁/.test(full)) return '交通';
  if (/餐饮|吃|饭|餐|food|drink|酒|咖啡|早餐|午餐|晚餐|早饭|午饭|晚饭|宵夜|夜宵|点餐|小吃/.test(full)) return '餐饮';
  if (/住宿|hotel|宾馆|民宿|房费|住店/.test(full)) return '住宿';
  if (/门票|ticket|门|景区|博物馆|展馆|公园票/.test(full)) return '门票';
  if (/购物|buy|shop|纪念品|超市|mall|购买|买菜|商店/.test(full)) return '购物';
  if (/活动|play|活动费|娱乐|bar|club|ktv|体验|游玩|项目/.test(full)) return '活动';
  return '其他';
}


const fs = require('fs');
const crypto = require('crypto');

const envText = fs.readFileSync('.env.local', 'utf8');
const env = Object.fromEntries(
  envText
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l && !/^#/.test(l))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i), l.slice(i + 1)];
    })
);

const HOST = env.IFLYTEK_IAT_HOST || 'ws-api.xfyun.cn';
const PATH = '/v2/iat';
const date = new Date().toUTCString();
const origin = `host: ${HOST}\n` + `date: ${date}\n` + `GET ${PATH} HTTP/1.1`;
const secret = env.IFLYTEK_API_SECRET;
const sig = crypto.createHmac('sha256', secret).update(origin).digest('base64');
let sigDecoded;
try {
  const dec = Buffer.from(secret, 'base64');
  sigDecoded = crypto.createHmac('sha256', dec).update(origin).digest('base64');
} catch {
  sigDecoded = sig;
}

const authQuoted = `api_key="${env.IFLYTEK_API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${sig}"`;
const authQuotedDec = `api_key="${env.IFLYTEK_API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${sigDecoded}"`;
const authNoQuotes = `api_key=${env.IFLYTEK_API_KEY}, algorithm=hmac-sha256, headers=host date request-line, signature=${sig}`;
const authNoQuotesDec = `api_key=${env.IFLYTEK_API_KEY}, algorithm=hmac-sha256, headers=host date request-line, signature=${sigDecoded}`;

const urlQuoted = `wss://${HOST}${PATH}?authorization=${encodeURIComponent(authQuoted)}&date=${encodeURIComponent(date)}&host=${encodeURIComponent(HOST)}`;
const urlQuotedDec = `wss://${HOST}${PATH}?authorization=${encodeURIComponent(authQuotedDec)}&date=${encodeURIComponent(date)}&host=${encodeURIComponent(HOST)}`;
const urlNoQuotes = `wss://${HOST}${PATH}?authorization=${encodeURIComponent(authNoQuotes)}&date=${encodeURIComponent(date)}&host=${encodeURIComponent(HOST)}`;
const urlNoQuotesDec = `wss://${HOST}${PATH}?authorization=${encodeURIComponent(authNoQuotesDec)}&date=${encodeURIComponent(date)}&host=${encodeURIComponent(HOST)}`;

console.log('Q', urlQuoted);
console.log('N', urlNoQuotes);
console.log('QD', urlQuotedDec);
console.log('ND', urlNoQuotesDec);
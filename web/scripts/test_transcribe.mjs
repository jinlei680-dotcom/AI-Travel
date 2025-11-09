import http from "node:http";
import { Buffer } from "node:buffer";

function createSilenceWav(durationSec = 0.5, sampleRate = 16000) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const numSamples = Math.floor(durationSec * sampleRate);
  const dataSize = numSamples * numChannels * bytesPerSample;

  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  const byteRate = sampleRate * numChannels * bytesPerSample;
  header.writeUInt32LE(byteRate, 28);
  const blockAlign = numChannels * bytesPerSample;
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  const data = Buffer.alloc(dataSize); // silence
  return Buffer.concat([header, data]);
}

async function main() {
  const wav = createSilenceWav();
  const resp = await fetch("http://localhost:3000/api/voice/transcribe", {
    method: "POST",
    headers: { "Content-Type": "audio/wav" },
    body: wav,
  });
  const txt = await resp.text();
  console.log("status:", resp.status);
  console.log(txt);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
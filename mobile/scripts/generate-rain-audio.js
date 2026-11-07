/* global Buffer, __dirname */

const fs = require('node:fs');
const path = require('node:path');

const sampleRate = 22050;
const seconds = 8;
const sampleCount = sampleRate * seconds;
const dataSize = sampleCount * 2;
const output = Buffer.alloc(44 + dataSize);
const outputPath = path.join(__dirname, '..', 'assets', 'asmr-rain.wav');

output.write('RIFF', 0);
output.writeUInt32LE(36 + dataSize, 4);
output.write('WAVE', 8);
output.write('fmt ', 12);
output.writeUInt32LE(16, 16);
output.writeUInt16LE(1, 20);
output.writeUInt16LE(1, 22);
output.writeUInt32LE(sampleRate, 24);
output.writeUInt32LE(sampleRate * 2, 28);
output.writeUInt16LE(2, 32);
output.writeUInt16LE(16, 34);
output.write('data', 36);
output.writeUInt32LE(dataSize, 40);

let seed = 123456789;
let smoothNoise = 0;
for (let index = 0; index < sampleCount; index += 1) {
  seed = (1664525 * seed + 1013904223) >>> 0;
  const whiteNoise = (seed / 0xffffffff) * 2 - 1;
  smoothNoise = smoothNoise * 0.985 + whiteNoise * 0.015;
  const gentleRain = smoothNoise * 0.42 + whiteNoise * 0.025;
  const fadeIn = Math.min(1, index / (sampleRate * 0.15));
  const fadeOut = Math.min(1, (sampleCount - index) / (sampleRate * 0.15));
  const sample = Math.max(-1, Math.min(1, gentleRain * fadeIn * fadeOut * 0.22));
  output.writeInt16LE(Math.round(sample * 32767), 44 + index * 2);
}

fs.writeFileSync(outputPath, output);
console.log(`Created ${outputPath}`);

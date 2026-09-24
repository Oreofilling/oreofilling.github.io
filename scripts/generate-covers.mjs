// 一次性脚本:生成分类头图(1600x900 渐变 + 光斑),输出到 src/assets/images/covers/
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const W = 1600;
const H = 900;

const covers = {
  // C++ / 系统底层 —— 靛蓝
  cpp: ["#1e1b4b", "#1d4ed8", "#22d3ee"],
  // 算法 —— 青绿
  algo: ["#042f2e", "#0d9488", "#a3e635"],
  // 刷题/总结 —— 紫
  practice: ["#2e1065", "#7c3aed", "#f472b6"],
  // Linux/网络 —— 琥珀
  linux: ["#431407", "#c2410c", "#fbbf24"],
  // 生活随笔 —— 玫红
  life: ["#4c0519", "#be123c", "#fda4af"],
};

function svgFor([base, main, glow]) {
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${main}"/>
      <stop offset="55%" stop-color="${base}"/>
      <stop offset="100%" stop-color="${base}"/>
    </linearGradient>
    <radialGradient id="glow1" cx="18%" cy="28%" r="45%">
      <stop offset="0%" stop-color="${glow}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="82%" cy="75%" r="50%">
      <stop offset="0%" stop-color="${main}" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="${main}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="46" height="46" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.4" fill="#ffffff" fill-opacity="0.07"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <circle cx="1320" cy="180" r="220" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1.5"/>
  <circle cx="1320" cy="180" r="150" fill="none" stroke="#ffffff" stroke-opacity="0.10" stroke-width="1.5"/>
  <circle cx="1320" cy="180" r="85" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1.5"/>
  <path d="M -40 720 L 420 260 L 540 260 L 80 820 Z" fill="#ffffff" fill-opacity="0.05"/>
  <path d="M 60 900 L 620 340 L 700 340 L 200 900 Z" fill="#ffffff" fill-opacity="0.04"/>
</svg>`;
}

const outDir = path.join(process.cwd(), "src", "assets", "images", "covers");
await mkdir(outDir, { recursive: true });

for (const [name, palette] of Object.entries(covers)) {
  const buf = await sharp(Buffer.from(svgFor(palette)))
    .jpeg({ quality: 82, progressive: true })
    .toBuffer();
  await writeFile(path.join(outDir, `${name}.jpg`), buf);
  console.log(`${name}.jpg  ${(buf.length / 1024).toFixed(0)} KB`);
}

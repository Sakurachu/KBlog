import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { mlccPosters } from "./mlcc-poster-data.mjs";

const ROOT = process.cwd();
const VISUAL_DIR = path.join(ROOT, "output", "imagegen", "mlcc", "visuals");
const POSTER_DIR = path.join(ROOT, "output", "imagegen", "mlcc", "posters");
const WIDTH = 1080;
const HEIGHT = 1440;

const colors = {
  bg: "#070511",
  panel: "#100822",
  panel2: "#160b2d",
  line: "#6735a6",
  violet: "#a86cff",
  purple: "#742fcb",
  white: "#f7f4ff",
  muted: "#c9bddc",
  yellow: "#f7df47",
  red: "#ff5b63",
  green: "#77e3bd",
  blue: "#65bfff",
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function charWidth(char) {
  return /[\u0000-\u00ff]/.test(char) ? 0.56 : 1;
}

function wrap(text, maxUnits, maxLines = 3) {
  const source = String(text);
  const lines = [];
  let line = "";
  let units = 0;
  for (const char of source) {
    const width = charWidth(char);
    if (units + width > maxUnits && line) {
      lines.push(line);
      if (lines.length === maxLines) {
        const last = lines.length - 1;
        lines[last] = `${lines[last].slice(0, -1)}…`;
        return lines;
      }
      line = char;
      units = width;
    } else {
      line += char;
      units += width;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

function textLines(text, x, y, options = {}) {
  const {
    size = 22,
    fill = colors.white,
    weight = 400,
    lineHeight = Math.round(size * 1.45),
    maxUnits = 30,
    maxLines = 3,
    anchor = "start",
    family = "Microsoft YaHei, Noto Sans CJK SC, sans-serif",
  } = options;
  const lines = wrap(text, maxUnits, maxLines);
  return `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" font-family="${family}" letter-spacing="0">${lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}">${esc(line)}</tspan>`)
    .join("")}</text>`;
}

function sectionTag(label, x, y, width) {
  return `
    <path d="M${x} ${y}h${width - 18}l18 18-18 18H${x}z" fill="#2a1250" stroke="${colors.line}" stroke-width="1.5"/>
    <text x="${x + 14}" y="${y + 25}" fill="${colors.white}" font-size="22" font-weight="700" font-family="Microsoft YaHei, sans-serif">${esc(label)}</text>`;
}

function borderRect(x, y, width, height, radius = 6, fill = colors.panel) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${colors.line}" stroke-width="1.5"/>`;
}

function featureBand(features) {
  const x = 24;
  const y = 244;
  const width = 1032;
  const itemWidth = width / features.length;
  let body = borderRect(x, y, width, 88, 5, "#0d071b");
  features.forEach(([label, detail], index) => {
    const left = x + index * itemWidth;
    if (index > 0) body += `<line x1="${left}" y1="254" x2="${left}" y2="322" stroke="#3d2362"/>`;
    body += `<circle cx="${left + 25}" cy="275" r="13" fill="#2b1250" stroke="${colors.violet}" stroke-width="1.5"/>`;
    body += `<text x="${left + 25}" y="281" text-anchor="middle" fill="${colors.white}" font-size="14" font-weight="700" font-family="Arial">${index + 1}</text>`;
    body += textLines(label, left + 46, 271, { size: 17, weight: 700, maxUnits: 10, maxLines: 1 });
    body += textLines(detail, left + 46, 296, { size: 12, fill: colors.muted, maxUnits: 13, maxLines: 2, lineHeight: 17 });
  });
  return body;
}

function calloutLabels(callouts) {
  const positions = [
    [48, 425],
    [48, 500],
    [48, 650],
    [520, 715],
  ];
  return callouts
    .map((label, index) => {
      const [x, y] = positions[index];
      const width = Math.min(220, 52 + label.length * 16);
      const targetX = index === 3 ? 570 : 250 + index * 95;
      const targetY = index === 3 ? 665 : 500 + index * 50;
      return `${borderRect(x, y, width, 39, 5, "#1a0c35e8")}
        <text x="${x + 12}" y="${y + 26}" fill="${colors.white}" font-size="15" font-weight="600" font-family="Microsoft YaHei, sans-serif">${esc(label)}</text>
        <line x1="${x + width}" y1="${y + 20}" x2="${targetX}" y2="${targetY}" stroke="${colors.violet}" stroke-width="1.5"/>`;
    })
    .join("");
}

function metricPanel(metrics) {
  const x = 790;
  const y = 374;
  const width = 266;
  let body = borderRect(x, y, width, 430, 4, "#110824");
  metrics.forEach(([label, value, note], index) => {
    const top = y + index * 84;
    if (index > 0) body += `<line x1="${x + 18}" y1="${top}" x2="${x + width - 18}" y2="${top}" stroke="#392058" stroke-dasharray="3 3"/>`;
    body += `<circle cx="${x + 27}" cy="${top + 28}" r="11" fill="none" stroke="${index % 2 ? colors.blue : colors.violet}" stroke-width="2"/>`;
    body += textLines(label, x + 49, top + 24, { size: 15, weight: 700, maxUnits: 12, maxLines: 1 });
    body += textLines(value, x + 49, top + 48, { size: 19, weight: 800, fill: colors.yellow, maxUnits: 13, maxLines: 1 });
    body += textLines(note, x + 49, top + 68, { size: 11, fill: colors.muted, maxUnits: 19, maxLines: 1 });
  });
  return body;
}

function flowBand(flow) {
  const x = 24;
  const y = 852;
  const gap = 12;
  const width = (1032 - gap * 4) / 5;
  return flow
    .map((label, index) => {
      const left = x + index * (width + gap);
      const arrow = index < 4 ? `<path d="M${left + width + 2} 896h8l-4-5m4 5-4 5" stroke="${colors.violet}" stroke-width="2" fill="none"/>` : "";
      return `${borderRect(left, y, width, 74, 5, "#120826")}
        <rect x="${left + 12}" y="${y + 10}" width="26" height="25" rx="4" fill="#6e2fb0"/>
        <text x="${left + 25}" y="${y + 28}" text-anchor="middle" fill="white" font-size="13" font-weight="700" font-family="Arial">${index + 1}</text>
        ${textLines(label, left + 12, y + 57, { size: 15, weight: 700, maxUnits: 11, maxLines: 1 })}${arrow}`;
    })
    .join("");
}

function defectCards(defects) {
  const x = 24;
  const y = 982;
  const gap = 14;
  const width = (1032 - gap * 2) / 3;
  return defects
    .map(([name, english, cause, effect], index) => {
      const left = x + index * (width + gap);
      const accent = [colors.red, "#ff8d5b", "#ff5b9d"][index];
      return `${borderRect(left, y, width, 206, 6, "#0e071b")}
        <rect x="${left + 1}" y="${y + 1}" width="${width - 2}" height="48" rx="5" fill="#21102d"/>
        <text x="${left + 16}" y="${y + 31}" fill="${accent}" font-size="20" font-weight="800" font-family="Microsoft YaHei, sans-serif">${esc(name)} <tspan font-size="13">(${esc(english)})</tspan></text>
        <circle cx="${left + 34}" cy="${y + 91}" r="19" fill="#2a1232" stroke="${accent}" stroke-width="2"/>
        <path d="M${left + 26} ${y + 83}l16 16m0-16-16 16" stroke="${accent}" stroke-width="3"/>
        ${textLines("原因", left + 66, y + 76, { size: 13, weight: 700, fill: colors.violet, maxUnits: 5, maxLines: 1 })}
        ${textLines(cause, left + 66, y + 98, { size: 13, fill: colors.white, maxUnits: 22, maxLines: 2, lineHeight: 19 })}
        <line x1="${left + 16}" y1="${y + 132}" x2="${left + width - 16}" y2="${y + 132}" stroke="#3d2350"/>
        ${textLines("影响", left + 16, y + 154, { size: 13, weight: 700, fill: colors.violet, maxUnits: 5, maxLines: 1 })}
        ${textLines(effect, left + 16, y + 177, { size: 13, fill: colors.muted, maxUnits: 27, maxLines: 2, lineHeight: 18 })}`;
    })
    .join("");
}

function benefitBand(benefits) {
  const x = 24;
  const y = 1210;
  const width = 1032 / 4;
  let body = borderRect(x, y, 1032, 91, 4, "#13082a");
  benefits.forEach((benefit, index) => {
    const left = x + index * width;
    if (index > 0) body += `<line x1="${left}" y1="1226" x2="${left}" y2="1285" stroke="#422667"/>`;
    const symbol = ["✓", "◎", "↗", "▦"][index];
    body += `<circle cx="${left + 36}" cy="1256" r="20" fill="#2a1154" stroke="${colors.violet}" stroke-width="1.5"/>
      <text x="${left + 36}" y="1264" text-anchor="middle" fill="${colors.white}" font-size="22" font-weight="700" font-family="Arial">${symbol}</text>
      ${textLines(benefit, left + 68, 1253, { size: 18, weight: 700, maxUnits: 10, maxLines: 1 })}
      ${textLines(["降低过程波动", "保证批间一致", "提升量产效率", "数据闭环追踪"][index], left + 68, 1278, { size: 12, fill: colors.muted, maxUnits: 14, maxLines: 1 })}`;
  });
  return body;
}

async function renderPoster(poster, index) {
  const visualPath = path.join(VISUAL_DIR, `${poster.slug}.webp`);
  const visual = await sharp(visualPath).png().toBuffer();
  const visualData = `data:image/png;base64,${visual.toString("base64")}`;
  const number = String(index + 1).padStart(2, "0");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs>
      <clipPath id="visualClip"><rect x="24" y="374" width="744" height="430" rx="5"/></clipPath>
      <linearGradient id="topFade" x1="0" x2="1"><stop offset="0" stop-color="#090514"/><stop offset="1" stop-color="#21084a"/></linearGradient>
      <linearGradient id="imageShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0.55" stop-color="#00000000"/><stop offset="1" stop-color="#070511cc"/></linearGradient>
    </defs>
    <rect width="1080" height="1440" fill="${colors.bg}"/>
    <rect width="1080" height="52" fill="url(#topFade)"/>
    <line x1="0" y1="52" x2="1080" y2="52" stroke="${colors.line}"/>
    <text x="24" y="35" fill="${colors.white}" font-size="18" font-weight="700" font-family="Microsoft YaHei, sans-serif">MLCC 精密制造工艺 <tspan fill="${colors.violet}">|</tspan> Multi-Layer Ceramic Capacitor</text>
    <path d="M932 0h148v52H912l20-26z" fill="#35116d"/>
    <text x="1000" y="36" text-anchor="middle" fill="white" font-size="24" font-weight="800" font-style="italic" font-family="Arial">${number}<tspan font-size="16">/10</tspan></text>

    <path d="M25 72h132l12 12v93l-12 12H25l-12-12V84z" fill="#260a55" stroke="#8b4de0" stroke-width="2"/>
    <path d="M34 80h114l10 10v82l-10 9H34l-10-9V90z" fill="#16082e" stroke="#6735a6"/>
    <text x="91" y="154" text-anchor="middle" fill="white" font-size="72" font-weight="900" font-style="italic" font-family="Arial">${number}</text>
    ${textLines(poster.title, 188, 116, { size: 48, weight: 900, maxUnits: 17, maxLines: 1 })}
    ${textLines(poster.subtitle, 188, 162, { size: 21, weight: 700, fill: colors.violet, maxUnits: 38, maxLines: 1 })}
    ${textLines(poster.summary, 25, 209, { size: 18, fill: colors.white, maxUnits: 56, maxLines: 2, lineHeight: 28 })}

    ${featureBand(poster.features)}
    ${sectionTag("系统结构示意", 24, 340, 250)}
    ${sectionTag("关键指标", 790, 340, 266)}
    <image href="${visualData}" x="24" y="374" width="744" height="430" preserveAspectRatio="xMidYMid slice" clip-path="url(#visualClip)"/>
    <rect x="24" y="374" width="744" height="430" rx="5" fill="url(#imageShade)" stroke="${colors.line}" stroke-width="1.5"/>
    ${calloutLabels(poster.callouts)}
    ${metricPanel(poster.metrics)}
    ${sectionTag("工艺流程", 24, 816, 210)}
    ${flowBand(poster.flow)}
    ${sectionTag("典型不良与影响", 24, 946, 310)}
    ${defectCards(poster.defects)}
    ${benefitBand(poster.benefits)}
    <text x="24" y="1330" fill="#d4c9e7" font-size="14" font-family="Microsoft YaHei, sans-serif">资料框架：Murata MLCC 生产流程与绿片工艺说明</text>
    <text x="24" y="1355" fill="#8e83a2" font-size="13" font-family="Microsoft YaHei, sans-serif">注：指标为典型工程目标/常见范围，实际值受产品尺寸、材料体系、设备与验收口径影响。</text>
    <text x="1056" y="1355" text-anchor="end" fill="#8e83a2" font-size="12" font-family="Arial">KAIROS SEMI · MLCC PROCESS SERIES</text>
    <rect x="0" y="1386" width="1080" height="54" fill="#05030b"/>
    <text x="24" y="1420" fill="#a89eb8" font-size="14" font-family="Microsoft YaHei, sans-serif">精密制造行业能力地图 · MLCC</text>
    <text x="1056" y="1420" text-anchor="end" fill="#a89eb8" font-size="14" font-family="Microsoft YaHei, sans-serif">工程示意 · 非设备承诺值</text>
  </svg>`;

  const outputPath = path.join(POSTER_DIR, `${poster.slug}.png`);
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outputPath);
  return outputPath;
}

await fs.mkdir(POSTER_DIR, { recursive: true });
const outputs = [];
for (let index = 0; index < mlccPosters.length; index += 1) {
  outputs.push(await renderPoster(mlccPosters[index], index));
}
console.log(outputs.join("\n"));

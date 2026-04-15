// diagram.js — SVG rajah balapan olahraga (engineering style)

const LANE_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'
];

/**
 * Render rajah SVG balapan oval dengan dimension lines
 * @param {Object} trackData   - Hasil calculateTrack()
 * @param {number} trackType   - Jenis balapan (150/200/300/400)
 * @param {number} fieldLength - Panjang padang (m)
 * @param {number} fieldWidth  - Lebar padang (m)
 */
export function renderDiagram(trackData, trackType, fieldLength, fieldWidth) {
  const { rInner, rOuter, straight, lanes: laneData } = trackData;
  const n = laneData.length;

  // Margins (ruang untuk title + dimension lines)
  const W = 760, mT = 72, mB = 52, mL = 90, mR = 50;
  const availW = W - mL - mR;

  // Scale: fit lebar, cap tinggi pada 480px
  const trackW = straight + 2 * rOuter;
  const trackH = 2 * rOuter;
  const scale  = Math.min(availW / trackW, (480 - mT - mB) / trackH);

  const sS  = straight * scale;
  const sRi = rInner * scale;
  const sRo = rOuter * scale;
  const sLW = ((rOuter - rInner) / n) * scale;

  const H  = mT + 2 * sRo + mB;
  const cx = mL + availW / 2;
  const cy = mT + sRo;
  const lx = cx - sS / 2;   // pusat lengkung kiri
  const rx = cx + sS / 2;   // pusat lengkung kanan
  const tTop = cy - sRo;
  const tBot = cy + sRo;

  const svg = mkSVG(W, H);

  // Latar belakang
  mkEl(svg, 'rect', { width: W, height: H, fill: '#f8fafc' });

  // Sempadan padang (dashed rectangle)
  if (fieldLength && fieldWidth) {
    mkEl(svg, 'rect', {
      x: cx - fieldLength * scale / 2,
      y: cy - fieldWidth * scale / 2,
      width: fieldLength * scale,
      height: fieldWidth * scale,
      fill: '#f0fdf4', stroke: '#94a3b8',
      'stroke-dasharray': '6,4', 'stroke-width': 1
    });
  }

  // ── LUKIS LORONG (filled ovals, luar → dalam) ──────────────
  // Setiap oval besar dilukis dulu, oval kecil tutup bahagian dalam
  // — hasilnya setiap lorong kelihatan sebagai jalur berwarna
  for (let i = n; i >= 1; i--) {
    const r = sRi + i * sLW;
    drawOval(svg, cx, cy, sS, r, '#fff', LANE_COLORS[(i - 1) % LANE_COLORS.length]);
  }
  // Padang dalam (hijau)
  drawOval(svg, cx, cy, sS, sRi, '#16a34a', '#86efac');

  // Label lorong — tersebar sepanjang arc kiri
  for (let i = 1; i <= n; i++) {
    const r   = sRi + (i - 0.5) * sLW;
    const ang = (i / (n + 1)) * Math.PI;           // agih dari atas ke bawah
    const px  = lx - r * Math.sin(ang);
    const py  = cy - r * Math.cos(ang) + 4;
    mkTxt(svg, px, py, `L${i}`, '#fff', 8, 'middle', 'bold');
  }

  // Garisan penamat (putus-putus, di pusat lengkung kanan)
  mkEl(svg, 'line', {
    x1: rx, y1: tTop, x2: rx, y2: tBot,
    stroke: '#fff', 'stroke-width': 2, 'stroke-dasharray': '5,3'
  });
  mkTxt(svg, rx + 5, tTop - 4, 'PENAMAT', '#1e3a5f', 8, 'start', 'bold');

  // ── DIMENSION LINES ────────────────────────────────────────

  // 1. Panjang garis lurus (atas)
  hDim(svg, lx, rx, tTop - 18, `${straight}m`, '#1d4ed8', tTop);

  // 2. Panjang padang (bawah)
  if (fieldLength) {
    const fw = fieldLength * scale;
    hDim(svg, cx - fw / 2, cx + fw / 2, tBot + 28, `${fieldLength}m`, '#64748b', tBot);
  }

  // 3. Lebar padang (kiri, menegak)
  if (fieldWidth) {
    const fh = fieldWidth * scale;
    vDim(svg, lx - sRo - 30, cy - fh / 2, cy + fh / 2, `${fieldWidth}m`, '#64748b');
  }

  // ── TAJUK ──────────────────────────────────────────────────
  mkTxt(svg, W / 2, 16, `RAJAH BALAPAN ${trackType}M`, '#111827', 14, 'middle', 'bold');
  if (fieldLength && fieldWidth) {
    mkTxt(svg, W / 2, 34, `DI ATAS PADANG ${fieldLength}M × ${fieldWidth}M`, '#6b7280', 10, 'middle');
  }

  return svg;
}

// ── PEMBANTU ───────────────────────────────────────────────────

function mkSVG(w, h) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', `0 0 ${w} ${h}`);
  s.setAttribute('class', 'track-svg');
  s.setAttribute('width', w);
  s.setAttribute('height', h);
  return s;
}

function mkEl(parent, tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  parent.appendChild(el);
  return el;
}

function mkTxt(parent, x, y, text, color, size, anchor = 'middle', weight = 'normal') {
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  Object.entries({ x, y, fill: color, 'font-size': size, 'text-anchor': anchor,
    'font-family': 'Arial, sans-serif', 'font-weight': weight })
    .forEach(([k, v]) => t.setAttribute(k, v));
  t.textContent = text;
  parent.appendChild(t);
  return t;
}

function drawOval(parent, cx, cy, s, r, stroke, fill) {
  const x1 = cx - s / 2, x2 = cx + s / 2;
  mkEl(parent, 'path', {
    d: `M${x1} ${cy-r} L${x2} ${cy-r} A${r} ${r} 0 0 1 ${x2} ${cy+r} L${x1} ${cy+r} A${r} ${r} 0 0 1 ${x1} ${cy-r}Z`,
    stroke, 'stroke-width': 1, fill: fill || 'none'
  });
}

// Garisan dimensi mendatar dengan anak panah di kedua hujung
function hDim(svg, x1, x2, y, label, color, tickY = null) {
  const mid = (x1 + x2) / 2, aw = 5;

  mkEl(svg, 'line', { x1, y1: y, x2, y2: y, stroke: color, 'stroke-width': 1 });
  mkEl(svg, 'polygon', { points: `${x1},${y} ${x1+aw},${y-aw/2} ${x1+aw},${y+aw/2}`, fill: color });
  mkEl(svg, 'polygon', { points: `${x2},${y} ${x2-aw},${y-aw/2} ${x2-aw},${y+aw/2}`, fill: color });

  if (tickY !== null) {
    mkEl(svg, 'line', { x1, y1: tickY, x2: x1, y2: y + 3, stroke: color, 'stroke-width': 0.8, 'stroke-dasharray': '2,2' });
    mkEl(svg, 'line', { x1: x2, y1: tickY, x2, y2: y + 3, stroke: color, 'stroke-width': 0.8, 'stroke-dasharray': '2,2' });
  }

  // Latar teks (supaya mudah dibaca)
  const lw = label.length * 5.5 + 4;
  mkEl(svg, 'rect', { x: mid - lw / 2, y: y - 9, width: lw, height: 13, fill: '#f8fafc' });
  mkTxt(svg, mid, y + 2, label, color, 9, 'middle', 'bold');
}

// Garisan dimensi menegak dengan anak panah
function vDim(svg, x, y1, y2, label, color) {
  const mid = (y1 + y2) / 2, aw = 5;

  mkEl(svg, 'line', { x1: x, y1, x2: x, y2, stroke: color, 'stroke-width': 1 });
  mkEl(svg, 'polygon', { points: `${x},${y1} ${x-aw/2},${y1+aw} ${x+aw/2},${y1+aw}`, fill: color });
  mkEl(svg, 'polygon', { points: `${x},${y2} ${x-aw/2},${y2-aw} ${x+aw/2},${y2-aw}`, fill: color });
  mkEl(svg, 'line', { x1: x+3, y1, x2: x+22, y2: y1, stroke: color, 'stroke-width': 0.8, 'stroke-dasharray': '2,2' });
  mkEl(svg, 'line', { x1: x+3, y1: y2, x2: x+22, y2, stroke: color, 'stroke-width': 0.8, 'stroke-dasharray': '2,2' });

  const t = mkTxt(svg, x - 4, mid, label, color, 9, 'middle', 'bold');
  t.setAttribute('transform', `rotate(-90, ${x - 4}, ${mid})`);
}

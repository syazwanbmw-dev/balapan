// diagram.js — SVG rajah balapan olahraga (engineering style dengan dimension lines)

const LANE_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'
];

/**
 * Render rajah SVG balapan oval (engineering style)
 * @param {Object} trackData   - Hasil dari calculateTrack()
 * @param {number} trackType   - Jenis balapan (150/200/300/400)
 * @param {number} fieldLength - Panjang padang (meter)
 * @param {number} fieldWidth  - Lebar padang (meter)
 * @returns {SVGElement}
 */
export function renderDiagram(trackData, trackType, fieldLength, fieldWidth) {
  const { rInner, rOuter, straight, lanes: laneData } = trackData;
  const n = laneData.length;

  // Layout margins (space for title, dimension lines, labels)
  const W = 760;
  const mT = 72;   // top: title + straight dimension
  const mB = 52;   // bottom: field length dimension
  const mL = 88;   // left: field width dimension + lane labels
  const mR = 48;

  const availW = W - mL - mR;
  const trackSpanH = straight + 2 * rOuter;   // total horizontal span of oval
  const trackSpanV = 2 * rOuter;               // total vertical span

  // Scale to fit available width, cap height at 190px
  const scale = Math.min(availW / trackSpanH, 190 / trackSpanV);

  const sS  = straight * scale;
  const sRi = rInner * scale;
  const sRo = rOuter * scale;
  const sLW = ((rOuter - rInner) / n) * scale;

  const H  = mT + 2 * sRo + mB;
  const cx = mL + availW / 2;
  const cy = mT + sRo;

  // Key x positions
  const lx   = cx - sS / 2;   // center of left semicircle
  const rx   = cx + sS / 2;   // center of right semicircle
  const tTop = cy - sRo;
  const tBot = cy + sRo;

  const svg = mkSVG(W, H);

  // Background
  mkEl(svg, 'rect', { width: W, height: H, fill: '#f8fafc' });

  // Field boundary (dashed rectangle)
  if (fieldLength && fieldWidth) {
    const fw = fieldLength * scale;
    const fh = fieldWidth * scale;
    mkEl(svg, 'rect', {
      x: cx - fw / 2, y: cy - fh / 2,
      width: fw, height: fh,
      fill: '#f0fdf4', stroke: '#94a3b8',
      'stroke-dasharray': '6,4', 'stroke-width': 1
    });
  }

  // Draw lanes outer → inner
  for (let i = n; i >= 1; i--) {
    const r = sRi + i * sLW;
    drawOval(svg, cx, cy, sS, r, LANE_COLORS[(i - 1) % LANE_COLORS.length], null);
  }

  // Inner field (green)
  drawOval(svg, cx, cy, sS, sRi, '#16a34a', '#86efac');

  // Lane labels at leftmost point of each lane arc
  for (let i = 1; i <= n; i++) {
    const r = sRi + (i - 0.5) * sLW;
    mkTxt(svg, lx - r, cy + 4, `L${i}`, '#fff', 9, 'middle', 'bold');
  }

  // Finish/start line (dashed white, at right curve center)
  mkEl(svg, 'line', {
    x1: rx, y1: tTop, x2: rx, y2: tBot,
    stroke: '#fff', 'stroke-width': 2, 'stroke-dasharray': '5,3'
  });
  mkTxt(svg, rx + 5, tTop - 4, 'PENAMAT', '#dc2626', 8, 'start', 'bold');

  // ── DIMENSION LINES ──────────────────────────────────────────

  // 1. Straight length — horizontal, above track
  hDim(svg, lx, rx, tTop - 18, `${straight}m`, '#1d4ed8', tTop);

  // 2. rOuter — right curve center to outer edge
  hDim(svg, rx, rx + sRo, cy - sLW * 0.8, `r = ${rOuter}m`, '#059669', null, true);

  // 3. rInner — right curve center to inner edge
  hDim(svg, rx, rx + sRi, cy + sLW * 1.2, `ri = ${rInner}m`, '#9333ea', null, true);

  // 4. Field width — left side, vertical
  if (fieldWidth) {
    const fh = fieldWidth * scale;
    vDim(svg, lx - sRo - 32, cy - fh / 2, cy + fh / 2, `${fieldWidth}m`, '#64748b');
  }

  // 5. Field length — bottom, horizontal
  if (fieldLength) {
    const fw = fieldLength * scale;
    hDim(svg, cx - fw / 2, cx + fw / 2, tBot + 28, `${fieldLength}m`, '#64748b', tBot);
  }

  // ── TITLE ────────────────────────────────────────────────────
  mkTxt(svg, W / 2, 16, `RAJAH BALAPAN ${trackType}M`, '#111827', 14, 'middle', 'bold');
  if (fieldLength && fieldWidth) {
    mkTxt(svg, W / 2, 34, `DI ATAS PADANG ${fieldLength}M × ${fieldWidth}M`, '#6b7280', 10, 'middle');
  }

  return svg;
}

// ── HELPER FUNCTIONS ──────────────────────────────────────────

function mkSVG(w, h) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('class', 'track-svg');
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);
  return svg;
}

function mkEl(parent, tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  parent.appendChild(el);
  return el;
}

function mkTxt(parent, x, y, text, color, size = 11, anchor = 'middle', weight = 'normal') {
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t.setAttribute('x', x);
  t.setAttribute('y', y);
  t.setAttribute('fill', color);
  t.setAttribute('font-size', size);
  t.setAttribute('text-anchor', anchor);
  t.setAttribute('font-family', 'Arial, sans-serif');
  t.setAttribute('font-weight', weight);
  t.textContent = text;
  parent.appendChild(t);
  return t;
}

function drawOval(parent, cx, cy, s, r, stroke, fill) {
  const x1 = cx - s / 2;
  const x2 = cx + s / 2;
  const d = [
    `M ${x1} ${cy - r}`,
    `L ${x2} ${cy - r}`,
    `A ${r} ${r} 0 0 1 ${x2} ${cy + r}`,
    `L ${x1} ${cy + r}`,
    `A ${r} ${r} 0 0 1 ${x1} ${cy - r}`,
    'Z'
  ].join(' ');
  mkEl(parent, 'path', { d, stroke, 'stroke-width': 1.5, fill: fill || 'none' });
}

/**
 * Horizontal dimension line dengan arrow di kedua hujung
 * @param {number} tickFromY - y position of track edge (for dashed extension line)
 * @param {boolean} noTicks  - skip extension lines (for internal dims)
 */
function hDim(svg, x1, x2, y, label, color, tickFromY = null, noTicks = false) {
  const mid = (x1 + x2) / 2;
  const aw = 5;

  // Main line
  mkEl(svg, 'line', { x1, y1: y, x2, y2: y, stroke: color, 'stroke-width': 1 });

  // Arrowhead kiri (pointing left)
  mkEl(svg, 'polygon', {
    points: `${x1},${y} ${x1 + aw},${y - aw / 2} ${x1 + aw},${y + aw / 2}`,
    fill: color
  });
  // Arrowhead kanan (pointing right)
  mkEl(svg, 'polygon', {
    points: `${x2},${y} ${x2 - aw},${y - aw / 2} ${x2 - aw},${y + aw / 2}`,
    fill: color
  });

  // Extension lines (dashed) dari track edge ke dimension line
  if (tickFromY !== null && !noTicks) {
    mkEl(svg, 'line', { x1, y1: tickFromY, x2: x1, y2: y + 3, stroke: color, 'stroke-width': 0.8, 'stroke-dasharray': '2,2' });
    mkEl(svg, 'line', { x1: x2, y1: tickFromY, x2, y2: y + 3, stroke: color, 'stroke-width': 0.8, 'stroke-dasharray': '2,2' });
  }

  // Label background (supaya teks mudah dibaca atas garisan)
  const lblW = label.length * 5.5 + 4;
  mkEl(svg, 'rect', { x: mid - lblW / 2, y: y - 9, width: lblW, height: 13, fill: '#f8fafc' });

  // Label
  mkTxt(svg, mid, y + 2, label, color, 9, 'middle', 'bold');
}

/**
 * Vertical dimension line
 */
function vDim(svg, x, y1, y2, label, color) {
  const mid = (y1 + y2) / 2;
  const aw = 5;

  // Main line
  mkEl(svg, 'line', { x1: x, y1, x2: x, y2, stroke: color, 'stroke-width': 1 });

  // Arrowhead atas (pointing up)
  mkEl(svg, 'polygon', {
    points: `${x},${y1} ${x - aw / 2},${y1 + aw} ${x + aw / 2},${y1 + aw}`,
    fill: color
  });
  // Arrowhead bawah (pointing down)
  mkEl(svg, 'polygon', {
    points: `${x},${y2} ${x - aw / 2},${y2 - aw} ${x + aw / 2},${y2 - aw}`,
    fill: color
  });

  // Extension lines (dashed) ke track edge
  mkEl(svg, 'line', { x1: x + 3, y1, x2: x + 22, y2: y1, stroke: color, 'stroke-width': 0.8, 'stroke-dasharray': '2,2' });
  mkEl(svg, 'line', { x1: x + 3, y1: y2, x2: x + 22, y2, stroke: color, 'stroke-width': 0.8, 'stroke-dasharray': '2,2' });

  // Rotated label
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t.setAttribute('x', x - 4);
  t.setAttribute('y', mid);
  t.setAttribute('fill', color);
  t.setAttribute('font-size', 9);
  t.setAttribute('font-weight', 'bold');
  t.setAttribute('font-family', 'Arial, sans-serif');
  t.setAttribute('text-anchor', 'middle');
  t.setAttribute('transform', `rotate(-90, ${x - 4}, ${mid})`);
  t.textContent = label;
  svg.appendChild(t);
}

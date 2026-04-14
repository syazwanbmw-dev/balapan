// diagram.js — SVG renderer untuk balapan olahraga

const LANE_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899'
];

/**
 * Render diagram SVG balapan oval
 * @param {Object} trackData - Hasil dari calculateTrack()
 * @param {number} trackType - Jenis balapan (150/200/300/400)
 * @returns {SVGElement}
 */
export function renderDiagram(trackData, trackType) {
  const { rInner, rOuter, straight, lanes: laneData } = trackData;

  // Canvas dimensions
  const svgWidth = 700;
  const margin = 60;
  const scale = Math.min(
    (svgWidth - margin * 2) / (straight * 2 + rOuter * 2),
    120 / rOuter
  );

  const scaledStraight = straight * scale;
  const scaledRInner = rInner * scale;
  const scaledROuter = rOuter * scale;
  const scaledLaneWidth = (rOuter - rInner) / laneData.length * scale;

  const trackWidth = scaledStraight * 2 + scaledROuter * 2;
  const trackHeight = scaledROuter * 2;
  const svgHeight = trackHeight + margin * 2;

  const cx = svgWidth / 2;
  const cy = svgHeight / 2;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
  svg.setAttribute('class', 'track-svg');
  svg.setAttribute('width', svgWidth);
  svg.setAttribute('height', svgHeight);

  // Background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', svgWidth);
  bg.setAttribute('height', svgHeight);
  bg.setAttribute('fill', '#f0fdf4');
  svg.appendChild(bg);

  // Draw lanes dari luar ke dalam
  for (let i = laneData.length; i >= 1; i--) {
    const r = scaledRInner + i * scaledLaneWidth;
    const color = LANE_COLORS[(i - 1) % LANE_COLORS.length];
    svg.appendChild(drawLane(cx, cy, scaledStraight, r, color, i === 1 ? '#fff' : null));
  }

  // Inner field (hijau)
  svg.appendChild(drawLane(cx, cy, scaledStraight, scaledRInner, '#16a34a', '#bbf7d0'));

  // Label ukuran
  addLabel(svg, cx + scaledStraight / 2, cy, `r = ${rInner}m`, '#1e40af');
  addLabel(svg, cx, cy - scaledROuter - 15, `Lurus = ${straight}m`, '#1e40af');
  for (let i = 1; i <= laneData.length; i++) {
    const r = scaledRInner + (i - 0.5) * scaledLaneWidth;
    addLabel(svg, cx - scaledStraight / 2 - r - 5, cy, `L${i}`, '#fff', 'end');
  }

  // Garisan permulaan (finish line)
  const finishX = cx + scaledStraight / 2 + scaledRInner;
  const finishLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  finishLine.setAttribute('x1', finishX);
  finishLine.setAttribute('y1', cy - scaledROuter);
  finishLine.setAttribute('x2', finishX);
  finishLine.setAttribute('y2', cy + scaledROuter);
  finishLine.setAttribute('stroke', '#fff');
  finishLine.setAttribute('stroke-width', '2');
  finishLine.setAttribute('stroke-dasharray', '4,2');
  svg.appendChild(finishLine);

  addLabel(svg, finishX + 5, cy - scaledROuter - 5, 'PENAMAT', '#fff', 'start', 9);

  return svg;
}

function drawLane(cx, cy, straight, r, stroke, fill) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const x1 = cx - straight / 2;
  const x2 = cx + straight / 2;
  const d = [
    `M ${x1} ${cy - r}`,
    `L ${x2} ${cy - r}`,
    `A ${r} ${r} 0 0 1 ${x2} ${cy + r}`,
    `L ${x1} ${cy + r}`,
    `A ${r} ${r} 0 0 1 ${x1} ${cy - r}`,
    'Z'
  ].join(' ');
  path.setAttribute('d', d);
  path.setAttribute('stroke', stroke);
  path.setAttribute('stroke-width', '1.5');
  path.setAttribute('fill', fill || 'none');
  return path;
}

function addLabel(svg, x, y, text, color, anchor = 'middle', size = 11) {
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t.setAttribute('x', x);
  t.setAttribute('y', y);
  t.setAttribute('fill', color);
  t.setAttribute('font-size', size);
  t.setAttribute('text-anchor', anchor);
  t.setAttribute('font-family', 'monospace');
  t.textContent = text;
  svg.appendChild(t);
}

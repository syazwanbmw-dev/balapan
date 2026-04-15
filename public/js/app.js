// app.js — Wire calculator, diagram, pdf + input validation

import { getValidConfigs, calculateTrack } from './calculator.js';
import { renderDiagram } from './diagram.js';
import { exportPDF } from './pdf.js';

// State
let currentTrackData = null;
let currentTrackType = null;
let currentSVG = null;
let fieldLength = null;
let fieldWidth = null;

// Elements
const inputLength = document.getElementById('input-length');
const inputWidth  = document.getElementById('input-width');
const inputLanes  = document.getElementById('input-lanes');
const btnCalc     = document.getElementById('btn-calculate');
const btnPDF      = document.getElementById('btn-pdf');
const errorMsg    = document.getElementById('error-msg');
const resultsSection  = document.getElementById('results-section');
const configList      = document.getElementById('config-list');
const emptyState      = document.getElementById('empty-state');
const outputSection   = document.getElementById('output-section');
const outputTitle     = document.getElementById('output-title');
const outputSubtitle  = document.getElementById('output-subtitle');
const diagramContainer = document.getElementById('diagram-container');
const tableBody       = document.getElementById('table-body');

// Validate input — return error string or null
function validateInputs(length, width) {
  if (!length || !width) return 'Sila masukkan panjang dan lebar padang.';
  if (length <= 0 || width <= 0) return 'Ukuran padang mestilah nombor positif.';
  if (length > 500 || width > 500) return 'Ukuran padang tidak melebihi 500 meter.';
  if (width > length) return 'Panjang padang mestilah lebih besar dari lebar.';
  return null;
}

// Handle calculate button
btnCalc.addEventListener('click', () => {
  const length = parseFloat(inputLength.value);
  const width  = parseFloat(inputWidth.value);
  const lanes  = parseInt(inputLanes.value);

  const err = validateInputs(length, width);
  if (err) {
    errorMsg.textContent = err;
    errorMsg.classList.remove('hidden');
    return;
  }
  errorMsg.classList.add('hidden');

  fieldLength = length;
  fieldWidth  = width;

  const validConfigs = getValidConfigs(length, width);

  if (validConfigs.length === 0) {
    errorMsg.textContent = 'Padang terlalu kecil. Tiada jenis balapan yang sesuai.';
    errorMsg.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    return;
  }

  // Render config buttons dalam sidebar
  configList.innerHTML = '';
  resultsSection.classList.remove('hidden');

  validConfigs.forEach(config => {
    const btn = document.createElement('button');
    btn.className = 'w-full text-left px-3 py-2 rounded-lg text-sm border border-red-800 text-red-200 hover:bg-red-800 hover:text-white transition-colors';
    btn.textContent = `✅ ${config.track}m · ${config.lanes} Lorong`;
    btn.addEventListener('click', () => showTrack(length, width, config.track, config.lanes, btn));
    configList.appendChild(btn);
  });

  // Auto-select pilihan pertama
  configList.firstChild.click();
});

// Show track for selected config
function showTrack(length, width, track, lanes, activeBtn) {
  // Highlight active button
  configList.querySelectorAll('button').forEach(b => {
    b.classList.remove('bg-red-700', 'text-white');
  });
  activeBtn.classList.add('bg-red-700', 'text-white');

  const data = calculateTrack(length, width, track, lanes);
  if (!data.feasible) {
    errorMsg.textContent = 'Konfigurasi ini tidak sesuai untuk saiz padang tersebut.';
    errorMsg.classList.remove('hidden');
    return;
  }

  currentTrackData = data;
  currentTrackType = track;

  // Update header
  outputTitle.textContent = `Balapan ${track}m — ${lanes} Lorong`;
  outputSubtitle.textContent = `Padang: ${length}m × ${width}m | Keluasan: ${(length * width).toLocaleString()}m² | Garis lurus: ${data.straight}m | Jejari: ${data.rInner}m`;

  // Render diagram
  const svg = renderDiagram(data, track, length, width);
  currentSVG = svg;
  diagramContainer.innerHTML = '';
  diagramContainer.appendChild(svg);

  // Render jadual
  tableBody.innerHTML = '';
  data.lanes.forEach((lane, idx) => {
    const tr = document.createElement('tr');
    tr.className = idx % 2 === 0 ? 'bg-gray-50' : 'bg-white';
    tr.innerHTML = `
      <td class="px-4 py-3 font-medium text-gray-700">Lorong ${lane.lane}</td>
      <td class="px-4 py-3 text-right font-mono text-gray-800">${lane.distance}m</td>
      <td class="px-4 py-3 text-right font-mono text-blue-600">+${lane.stagger}m</td>
      <td class="px-4 py-3 text-gray-600">${lane.start}</td>
    `;
    tableBody.appendChild(tr);
  });

  emptyState.classList.add('hidden');
  outputSection.classList.remove('hidden');
}

// PDF export
btnPDF.addEventListener('click', () => {
  if (!currentTrackData || !currentSVG) return;
  exportPDF(currentTrackData, currentTrackType, fieldLength, fieldWidth, currentSVG);
});

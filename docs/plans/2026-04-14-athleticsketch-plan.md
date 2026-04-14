# AthleticSketch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bina kalkulator balapan olahraga sekolah — guru masuk saiz padang, sistem kira ukuran balapan, papar diagram SVG + jadual ukuran, export PDF.

**Architecture:** Pure static site (HTML + Tailwind + Vanilla JS), tiada backend, tiada database. Semua kiraan berlaku dalam browser. Calculator.js menggunakan formula dari dokumen KPM (Bahagian Sukan, KPM) untuk kira dimensi balapan berdasarkan saiz padang input. Diagram dirender sebagai SVG inline. PDF dijanakan client-side menggunakan jsPDF.

**Tech Stack:** HTML5, Tailwind CSS (CDN), Vanilla JavaScript (ES6 modules), jsPDF (bundled), Cloudflare Pages

---

## File Map

```
athleticsketch/
├── CLAUDE.md                        ← The Map (routing rules)
├── CONTEXT.md                       ← Cross-workspace summary
├── _headers                         ← CSP headers untuk Cloudflare Pages
├── public/
│   ├── CONTEXT.md                   ← Frontend workspace context
│   ├── index.html                   ← Shell + layout utama
│   ├── js/
│   │   ├── calculator.js            ← Formula + area check logic (pure functions)
│   │   ├── diagram.js               ← SVG track renderer
│   │   ├── pdf.js                   ← jsPDF export handler
│   │   └── app.js                   ← Wire semua components + input validation
│   ├── css/
│   │   └── style.css                ← Custom overrides (Tailwind handled via CDN)
│   └── vendor/
│       └── jspdf.min.js             ← jsPDF bundled (bukan CDN)
├── tests/
│   └── calculator.test.js           ← Node.js unit tests untuk calculator.js
└── docs/
    ├── CONTEXT.md
    ├── specs/
    │   └── 2026-04-14-athleticsketch-design.md
    └── plans/
        └── 2026-04-14-athleticsketch-plan.md
```

---

## Task 1: Project Scaffold

**Files:**
- Create: `CLAUDE.md`
- Create: `CONTEXT.md`
- Create: `public/CONTEXT.md`
- Create: `docs/CONTEXT.md`
- Create: `_headers`
- Create: `public/css/style.css`

- [ ] **Step 1: Git init dan folder structure**

```bash
cd C:/Users/user/Documents/code
mkdir athleticsketch
cd athleticsketch
git init
mkdir -p public/js public/css public/vendor docs/specs docs/plans tests
```

- [ ] **Step 2: Tulis CLAUDE.md**

```markdown
# CLAUDE.md — AthleticSketch
*Layer 1: The Map — Routing rules untuk AI*

## Projek
- **Nama:** AthleticSketch — Kalkulator Balapan Olahraga Sekolah
- **Domain:** Cloudflare Pages (static site)
- **Status:** Dalam pembangunan
- **Repo:** `athleticsketch`
- **Deploy:** push ke `test` branch → verify → merge ke `main`

## Routing Rules

| Task | Baca | Skip |
|------|------|------|
| Calculator logic | `public/js/calculator.js`, `tests/calculator.test.js` | `public/js/diagram.js`, `public/js/pdf.js` |
| Diagram / SVG | `public/js/diagram.js`, `public/index.html` | `public/js/calculator.js` |
| PDF export | `public/js/pdf.js`, `public/js/app.js` | `public/js/diagram.js` |
| UI / layout | `public/index.html`, `public/css/style.css` | `public/js/calculator.js` |
| Security | `_headers` | `public/js/` |

## Struktur Workspace

```
athleticsketch/
├── CLAUDE.md             ← Kau di sini (Layer 1: The Map)
├── CONTEXT.md            ← Cross-workspace summary (Layer 2)
├── _headers              ← CSP headers Cloudflare Pages
├── public/               ← CODE room (semua frontend)
│   ├── CONTEXT.md
│   ├── index.html
│   ├── js/
│   │   ├── calculator.js
│   │   ├── diagram.js
│   │   ├── pdf.js
│   │   └── app.js
│   ├── css/style.css
│   └── vendor/jspdf.min.js
├── tests/
│   └── calculator.test.js
└── docs/                 ← KNOWLEDGE room
    ├── CONTEXT.md
    ├── specs/
    └── plans/
```

## Pantang Larang
- Jangan suggest TypeScript
- Jangan restructure folder tanpa tanya master
- Jangan install packages baru tanpa bagitahu dulu
- Jangan delete fail tanpa confirm dulu

## Pipeline Kerja
```
Code → sight-eagle/hone → commit-seal → push test → verify → merge main
```
```

- [ ] **Step 3: Tulis CONTEXT.md (root)**

```markdown
# CONTEXT.md — AthleticSketch
*Cross-workspace summary*

## Apa ini
Kalkulator balapan olahraga sekolah. Guru masuk saiz padang → sistem kira balapan yang boleh muat → papar diagram + jadual → export PDF.

## Status
Dalam pembangunan aktif.

## Rujukan Penting
- Spec: `docs/specs/2026-04-14-athleticsketch-design.md`
- Plan: `docs/plans/2026-04-14-athleticsketch-plan.md`
- Sumber formula: Garis Panduan KPM, Bahagian Sukan

## Tech
Pure static site — HTML + Tailwind CDN + Vanilla JS + jsPDF bundled. Deploy ke Cloudflare Pages.

## Entry Point
`public/index.html` → load `public/js/app.js` (type="module")
```

- [ ] **Step 4: Tulis public/CONTEXT.md**

```markdown
# CONTEXT.md — Frontend Workspace

## Fail Utama
- `index.html` — shell layout (sidebar + main content)
- `js/app.js` — entry point, wire semua modules, handle UI events
- `js/calculator.js` — pure functions: semak keluasan, kira dimensi balapan
- `js/diagram.js` — render SVG balapan dari hasil calculator
- `js/pdf.js` — export PDF 2 halaman menggunakan jsPDF
- `css/style.css` — custom CSS (Tailwind via CDN)
- `vendor/jspdf.min.js` — jsPDF bundled

## Data Flow
Input (panjang, lebar, lorong) → calculator.js → diagram.js + jadual → pdf.js
```

- [ ] **Step 5: Tulis docs/CONTEXT.md**

```markdown
# CONTEXT.md — Docs Workspace

## Fail
- `specs/2026-04-14-athleticsketch-design.md` — Full design spec (approved)
- `plans/2026-04-14-athleticsketch-plan.md` — Implementation plan ini
```

- [ ] **Step 6: Tulis _headers (CSP)**

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'none'; object-src 'none'; base-uri 'self'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
```

- [ ] **Step 7: Tulis public/css/style.css**

```css
/* Custom overrides — Tailwind handled via CDN */
.sidebar {
  min-height: 100vh;
}

.track-svg {
  max-width: 100%;
  height: auto;
}

.lane-label {
  font-size: 11px;
  font-family: monospace;
}

@media print {
  .no-print { display: none; }
}
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "chore: project scaffold — CLAUDE.md, CONTEXT.md, _headers, css"
```

---

## Task 2: Download dan Bundle jsPDF

**Files:**
- Create: `public/vendor/jspdf.min.js`

- [ ] **Step 1: Download jsPDF**

Pergi ke: https://github.com/parallax/jsPDF/releases

Download `jspdf.umd.min.js` dari release terkini (v2.5.x).
Simpan sebagai `public/vendor/jspdf.min.js`.

Atau guna curl:
```bash
curl -L "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" -o public/vendor/jspdf.min.js
```

- [ ] **Step 2: Verify fail wujud**

```bash
ls -la public/vendor/jspdf.min.js
```

Expected: fail ~300KB wujud.

- [ ] **Step 3: Commit**

```bash
git add public/vendor/jspdf.min.js
git commit -m "chore: bundle jsPDF v2.5.1 vendor"
```

---

## Task 3: calculator.js — Area Check + Config List

**Files:**
- Create: `public/js/calculator.js`
- Create: `tests/calculator.test.js`

- [ ] **Step 1: Tulis failing test**

`tests/calculator.test.js`:
```javascript
// Node.js test — run: node tests/calculator.test.js
import { getValidConfigs } from '../public/js/calculator.js';

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}: ${e.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'assertion failed');
}

// Padang 200m x 100m = 20,000 m² → sepatutnya muat 400m 8L
test('padang 200x100 muat 400m 8L', () => {
  const result = getValidConfigs(200, 100);
  const has400m8L = result.some(c => c.track === 400 && c.lanes === 8);
  assert(has400m8L, 'Expected 400m 8 lorong to fit');
});

// Padang 50m x 50m = 2,500 m² → tiada yang muat
test('padang 50x50 tiada konfigurasi', () => {
  const result = getValidConfigs(50, 50);
  assert(result.length === 0, 'Expected no configs to fit');
});

// Padang 80m x 60m = 4,800 m² → muat 200m 4L (>4021) tapi tidak 200m 6L (>4710)
test('padang 80x60 muat 200m 4L sahaja', () => {
  const result = getValidConfigs(80, 60);
  const has200m4L = result.some(c => c.track === 200 && c.lanes === 4);
  const has200m6L = result.some(c => c.track === 200 && c.lanes === 6);
  assert(has200m4L, 'Expected 200m 4L to fit');
  assert(!has200m6L, 'Expected 200m 6L NOT to fit');
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
```

- [ ] **Step 2: Run test — verify gagal**

```bash
node --experimental-vm-modules tests/calculator.test.js
```

Expected: Error kerana `calculator.js` belum wujud.

- [ ] **Step 3: Implement getValidConfigs dalam calculator.js**

`public/js/calculator.js`:
```javascript
// calculator.js — Formula engine balapan olahraga
// Rujukan: Garis Panduan KPM, Bahagian Sukan, Kementerian Pelajaran Malaysia

// Keluasan minimum (m²) ikut dokumen KPM
const MIN_AREA = {
  400: { 8: 16804.17, 6: 15482.82, 4: 14211.47 },
  300: { 8: 10248.86, 6: 9219.36,  4: 8239.86  },
  200: { 8: 5448.86,  6: 4710.18,  4: 4021.68  },
  150: { 8: 3548.16,  6: 3042.86,  4: 2504.17  }
};

// Track types dan bilangan lorong yang disokong
const TRACK_TYPES = [400, 300, 200, 150];
const LANE_OPTIONS = [8, 6, 4];

// Lebar lorong standard (tengah range 1.21m - 1.23m)
export const LANE_WIDTH = 1.22;

/**
 * Semak konfigurasi balapan yang boleh muat dalam padang
 * @param {number} fieldLength - Panjang padang (meter)
 * @param {number} fieldWidth - Lebar padang (meter)
 * @returns {Array} Senarai konfigurasi yang muat [{track, lanes}]
 */
export function getValidConfigs(fieldLength, fieldWidth) {
  const area = fieldLength * fieldWidth;
  const valid = [];

  for (const track of TRACK_TYPES) {
    for (const lanes of LANE_OPTIONS) {
      if (area > MIN_AREA[track][lanes]) {
        valid.push({ track, lanes });
      }
    }
  }

  return valid;
}
```

- [ ] **Step 4: Run test — verify lulus**

```bash
node --input-type=module < tests/calculator.test.js
```

Atau tambah `"type": "module"` dalam package.json dulu:
```bash
echo '{"type":"module"}' > package.json
node tests/calculator.test.js
```

Expected:
```
  ✅ padang 200x100 muat 400m 8L
  ✅ padang 50x50 tiada konfigurasi
  ✅ padang 80x60 muat 200m 4L sahaja

Results: 3 passed, 0 failed
```

- [ ] **Step 5: Commit**

```bash
git add public/js/calculator.js tests/calculator.test.js package.json
git commit -m "feat: calculator getValidConfigs — area check ikut standard KPM"
```

---

## Task 4: calculator.js — Formula Engine (Dimensi Balapan)

**Files:**
- Modify: `public/js/calculator.js`
- Modify: `tests/calculator.test.js`

- [ ] **Step 1: Tambah failing tests untuk calculateTrack**

Tambah di bawah tests sedia ada dalam `tests/calculator.test.js`:

```javascript
import { getValidConfigs, calculateTrack } from '../public/js/calculator.js';

// ... tests sedia ada ...

// Test calculateTrack untuk 200m pada padang 115x70m (standard KPM)
test('200m 8L pada padang 115x70 — lorong 1 = 200.00m', () => {
  const result = calculateTrack(115, 70, 200, 8);
  assert(result.feasible === true, 'Expected feasible');
  assert(Math.abs(result.lanes[0].distance - 200.00) < 0.5, 
    `Expected ~200m, got ${result.lanes[0].distance}`);
});

// Test stagger — setiap lorong mesti lebih jauh dari lorong sebelum
test('stagger mesti meningkat setiap lorong', () => {
  const result = calculateTrack(200, 100, 400, 8);
  assert(result.feasible === true, 'Expected feasible');
  for (let i = 1; i < result.lanes.length; i++) {
    assert(
      result.lanes[i].stagger > result.lanes[i-1].stagger,
      `Lorong ${i+1} stagger mesti > lorong ${i}`
    );
  }
});

// Test GL mesti positif
test('garis lurus mesti positif', () => {
  const result = calculateTrack(200, 100, 400, 8);
  assert(result.straight > 0, `Expected positive straight, got ${result.straight}`);
});

// Test padang terlalu sempit — tidak feasible
test('padang terlalu kecil untuk 400m — tidak feasible', () => {
  const result = calculateTrack(50, 40, 400, 4);
  assert(result.feasible === false, 'Expected not feasible');
});
```

- [ ] **Step 2: Run — verify gagal**

```bash
node tests/calculator.test.js
```

Expected: Error — `calculateTrack` not defined.

- [ ] **Step 3: Implement calculateTrack dalam calculator.js**

Tambah fungsi ini dalam `public/js/calculator.js`:

```javascript
// Garis lurus target (meter) untuk setiap jenis balapan
// Formula: GL = (target/2) - (jumlah lengkung / 2)
// Rujukan: Dokumen KPM — Rumusan Mencari Jarak Lengkung Balapan
const STRAIGHT_TARGET = {
  400: 200,  // GL = 200 - L
  300: 150,  // GL = 150 - L
  200: 100,  // GL = 100 - L
  150: 75    // GL = 75  - L
};

// Standard configs dari dokumen KPM (field_length x field_width → track dimensions)
// Digunakan untuk padang yang match exactly
const STANDARD_CONFIGS = [
  { track: 400, fieldLength: 183, fieldWidth: 80,  rInner: 30.48, rOuter: 48.19, straight: 85.69 },
  { track: 300, fieldLength: 158, fieldWidth: 68,  rInner: 19.23, rOuter: 29.23, straight: 79.11 },
  { track: 200, fieldLength: 115, fieldWidth: 70,  rInner: 18.00, rOuter: 24.60, straight: 36.53 },
  { track: 150, fieldLength:  75, fieldWidth: 50,  rInner: 15.00, rOuter: 20.00, straight: 22.64 }
];

/**
 * Kira dimensi balapan untuk saiz padang dan konfigurasi tertentu
 * @param {number} fieldLength - Panjang padang (meter)
 * @param {number} fieldWidth  - Lebar padang (meter)
 * @param {number} track       - Jenis balapan (150/200/300/400)
 * @param {number} lanes       - Bilangan lorong (4/6/8)
 * @returns {Object} { feasible, rInner, rOuter, straight, lanes: [{distance, stagger, start}] }
 */
export function calculateTrack(fieldLength, fieldWidth, track, lanes) {
  // Semak keluasan minimum
  const area = fieldLength * fieldWidth;
  if (area <= MIN_AREA[track][lanes]) {
    return { feasible: false };
  }

  let rInner, rOuter, straight;

  // Semak match standard config (tolerance ±2m)
  const stdMatch = STANDARD_CONFIGS.find(
    s => s.track === track &&
         Math.abs(s.fieldLength - fieldLength) <= 2 &&
         Math.abs(s.fieldWidth - fieldWidth) <= 2
  );

  if (stdMatch) {
    // Guna nilai tepat dari dokumen KPM
    rInner = stdMatch.rInner;
    rOuter = stdMatch.rOuter;
    straight = stdMatch.straight;
  } else {
    // Kira dinamik dari dimensi padang
    // Margin: 2m setiap sisi untuk ruang luar lorong
    const margin = 2.0;
    rOuter = (fieldWidth / 2) - margin;
    rInner = rOuter - (lanes * LANE_WIDTH);

    if (rInner <= 0) return { feasible: false };

    // Jumlah panjang lengkung (4 lengkung — 2 separuh bulatan)
    // a = (1/3) × π × (rOuter - rInner) × 2 [setiap hujung ada 2 lengkung]
    // Jumlah L = 2 × π × (rInner + (lanes × LANE_WIDTH / 2))
    const rMid = rInner + (lanes * LANE_WIDTH / 2);
    const totalCurve = 2 * Math.PI * rMid;

    // Garis lurus = target - separuh lengkung
    straight = STRAIGHT_TARGET[track] - (totalCurve / 2);

    if (straight <= 0) return { feasible: false };

    // Semak muat dalam panjang padang
    const requiredLength = (2 * straight) + (2 * rOuter) + (2 * margin);
    if (requiredLength > fieldLength) return { feasible: false };
  }

  // Kira jarak dan stagger setiap lorong
  const laneData = [];
  for (let i = 1; i <= lanes; i++) {
    const r = rInner + (i - 0.5) * LANE_WIDTH;
    const distance = (2 * straight) + (2 * Math.PI * r);
    const stagger = distance - ((2 * straight) + (2 * Math.PI * (rInner + 0.5 * LANE_WIDTH)));
    laneData.push({
      lane: i,
      distance: Math.round(distance * 100) / 100,
      stagger: Math.round(stagger * 100) / 100,
      start: i === 1 ? 'Garisan T' : `${Math.round(stagger * 100) / 100}m selepas T`
    });
  }

  return {
    feasible: true,
    rInner: Math.round(rInner * 100) / 100,
    rOuter: Math.round(rOuter * 100) / 100,
    straight: Math.round(straight * 100) / 100,
    lanes: laneData
  };
}
```

- [ ] **Step 4: Run tests — verify lulus**

```bash
node tests/calculator.test.js
```

Expected:
```
  ✅ padang 200x100 muat 400m 8L
  ✅ padang 50x50 tiada konfigurasi
  ✅ padang 80x60 muat 200m 4L sahaja
  ✅ 200m 8L pada padang 115x70 — lorong 1 = 200.00m
  ✅ stagger mesti meningkat setiap lorong
  ✅ garis lurus mesti positif
  ✅ padang terlalu kecil untuk 400m — tidak feasible

Results: 7 passed, 0 failed
```

- [ ] **Step 5: Commit**

```bash
git add public/js/calculator.js tests/calculator.test.js
git commit -m "feat: calculator calculateTrack — formula engine + standard KPM lookup"
```

---

## Task 5: index.html — Layout Shell

**Files:**
- Create: `public/index.html`

- [ ] **Step 1: Tulis index.html**

`public/index.html`:
```html
<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AthleticSketch — Kalkulator Balapan Olahraga</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="css/style.css">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#4f46e5',
            sidebar: '#1e1b4b'
          }
        }
      }
    }
  </script>
</head>
<body class="bg-gray-100 flex flex-col min-h-screen">

  <!-- Header -->
  <header class="bg-primary text-white py-3 px-6 flex items-center justify-between shadow-md">
    <div class="flex items-center gap-2">
      <span class="text-2xl">🏃</span>
      <span class="font-bold text-lg tracking-wide">AthleticSketch</span>
    </div>
    <span class="text-sm text-indigo-200">Kalkulator Balapan Olahraga Sekolah</span>
    <span class="text-xs text-indigo-300">celikguru.my</span>
  </header>

  <div class="flex flex-1">

    <!-- Sidebar -->
    <aside class="sidebar bg-sidebar text-white w-64 flex-shrink-0 p-5 flex flex-col gap-6">

      <!-- Input: Saiz Padang -->
      <div>
        <h2 class="text-xs font-semibold uppercase tracking-widest text-indigo-300 mb-3">
          📐 Saiz Padang
        </h2>

        <!-- Info tooltip -->
        <div class="bg-indigo-900 border border-indigo-700 rounded-lg p-3 mb-4 text-xs text-indigo-200 leading-relaxed">
          <span class="text-yellow-300 font-semibold">ℹ️ Penting:</span><br>
          Masukkan ukuran <strong>kawasan balapan SAHAJA</strong>.<br>
          Tidak termasuk:<br>
          • Khemah VIP / Urusetia<br>
          • Khemah rumah sukan<br>
          • Kawasan letak kenderaan
        </div>

        <label class="block text-xs text-indigo-300 mb-1">Panjang (meter)</label>
        <input id="input-length" type="number" min="1" max="500" step="0.1"
          placeholder="cth: 180"
          class="w-full bg-indigo-900 border border-indigo-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-400 mb-3">

        <label class="block text-xs text-indigo-300 mb-1">Lebar (meter)</label>
        <input id="input-width" type="number" min="1" max="500" step="0.1"
          placeholder="cth: 80"
          class="w-full bg-indigo-900 border border-indigo-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-400 mb-3">

        <label class="block text-xs text-indigo-300 mb-1">Bilangan Lorong</label>
        <select id="input-lanes"
          class="w-full bg-indigo-900 border border-indigo-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-400 mb-4">
          <option value="8">8 Lorong</option>
          <option value="6">6 Lorong</option>
          <option value="4" selected>4 Lorong</option>
        </select>

        <div id="error-msg" class="hidden text-red-400 text-xs mb-3"></div>

        <button id="btn-calculate"
          class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors">
          Kira Balapan
        </button>
      </div>

      <!-- Hasil: Cadangan Konfigurasi -->
      <div id="results-section" class="hidden">
        <h2 class="text-xs font-semibold uppercase tracking-widest text-indigo-300 mb-3">
          🏁 Cadangan
        </h2>
        <div id="config-list" class="flex flex-col gap-2"></div>
      </div>

    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 flex flex-col gap-6">

      <!-- Empty state -->
      <div id="empty-state" class="flex-1 flex flex-col items-center justify-center text-gray-400">
        <div class="text-6xl mb-4">🏟️</div>
        <p class="text-lg font-medium text-gray-500">Masukkan saiz padang untuk bermula</p>
        <p class="text-sm mt-1">Sistem akan mencadangkan jenis balapan yang sesuai</p>
      </div>

      <!-- Output: Diagram + Jadual -->
      <div id="output-section" class="hidden flex flex-col gap-6">

        <!-- Track info header -->
        <div class="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div>
            <h2 id="output-title" class="text-xl font-bold text-gray-800"></h2>
            <p id="output-subtitle" class="text-sm text-gray-500 mt-1"></p>
          </div>
          <button id="btn-pdf" class="no-print bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-5 rounded-lg text-sm transition-colors flex items-center gap-2">
            📄 Download PDF
          </button>
        </div>

        <!-- Diagram SVG -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Diagram Balapan</h3>
          <div id="diagram-container" class="flex justify-center"></div>
        </div>

        <!-- Jadual Ukuran -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Ukuran Per Lorong</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 text-gray-600">
                  <th class="px-4 py-3 text-left font-semibold">Lorong</th>
                  <th class="px-4 py-3 text-right font-semibold">Jarak</th>
                  <th class="px-4 py-3 text-right font-semibold">Stagger</th>
                  <th class="px-4 py-3 text-left font-semibold">Permulaan</th>
                </tr>
              </thead>
              <tbody id="table-body"></tbody>
            </table>
          </div>
          <div class="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            <strong>Nota:</strong> Lebar lorong: 1.22m | Tebal garisan: 5cm | Stagger dikira dari garisan T lorong 1
          </div>
        </div>

      </div>
    </main>
  </div>

  <!-- Footer -->
  <footer class="bg-primary text-indigo-200 text-xs text-center py-3">
    © AthleticSketch — Berdasarkan Garis Panduan KPM, Bahagian Sukan
  </footer>

  <script src="vendor/jspdf.min.js"></script>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Buka dalam browser — verify layout kelihatan betul**

Buka `public/index.html` dalam browser. Verify:
- Header purple kelihatan
- Sidebar gelap kelihatan dengan input fields
- Main content ada empty state "🏟️"
- Footer kelihatan

- [ ] **Step 3: Commit**

```bash
git add public/index.html
git commit -m "feat: index.html — layout shell sidebar + main content"
```

---

## Task 6: diagram.js — SVG Track Renderer

**Files:**
- Create: `public/js/diagram.js`

- [ ] **Step 1: Tulis diagram.js**

`public/js/diagram.js`:
```javascript
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
  // Radius label
  addLabel(svg, cx + scaledStraight / 2, cy, `r = ${rInner}m`, '#1e40af');
  // Straight label
  addLabel(svg, cx, cy - scaledROuter - 15, `Lurus = ${straight}m`, '#1e40af');
  // Lane labels
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
```

- [ ] **Step 2: Verify diagram render — manual test dalam browser**

Buka browser console pada `index.html`, run:
```javascript
import('./js/calculator.js').then(async ({calculateTrack}) => {
  const data = calculateTrack(115, 70, 200, 8);
  console.log('Track data:', data);
});
```

Expected: Object dengan `feasible: true`, `lanes` array, `straight`, `rInner`, `rOuter`.

- [ ] **Step 3: Commit**

```bash
git add public/js/diagram.js
git commit -m "feat: diagram.js — SVG track renderer dengan lane colors dan labels"
```

---

## Task 7: pdf.js — Export Handler

**Files:**
- Create: `public/js/pdf.js`

- [ ] **Step 1: Tulis pdf.js**

`public/js/pdf.js`:
```javascript
// pdf.js — Export PDF menggunakan jsPDF
// jsPDF diload sebagai global dari vendor/jspdf.min.js

const EQUIPMENT_LIST = [
  '15 batang besi penanda (panjang 30cm - 50cm)',
  'Pita ukur fibre glass tahan panas — 100m',
  'Pita ukur steel — 50m',
  'Pita ukur steel — 30m',
  'Kabel / Dawai 3mm — 60m',
  'Tali 7mm–10mm — 120m',
  '20 batang paku 20cm',
  'Minyak hitam atau cat putih',
  'Cat semburan',
  'Minyak penipis',
  'Roller atau berus cat (5cm)',
  '10 tukul besi'
];

const WARNINGS = [
  'Guna pita besi — pita plastik/fibre mutu rendah mengembang pada suhu tinggi dan mengecut pada suhu rendah.',
  'Besi penanda mesti panjang 30cm - 50cm.',
  'Guna pita ukur berbeza panjang untuk memudahkan kerja mengukur pada jarak yang bersesuaian.',
  'Pita fibre disyorkan untuk ketahanan pada panas.'
];

/**
 * Export hasil kiraan balapan sebagai PDF
 * @param {Object} trackData  - Hasil calculateTrack()
 * @param {number} trackType  - Jenis balapan
 * @param {number} fieldLength
 * @param {number} fieldWidth
 * @param {SVGElement} svgEl  - SVG diagram element
 */
export function exportPDF(trackData, trackType, fieldLength, fieldWidth, svgEl) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageW = 210;
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = margin;

  // ── HALAMAN 1 ──────────────────────────────────────────
  // Header
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageW, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('AthleticSketch — Laporan Balapan Olahraga', pageW / 2, 13, { align: 'center' });
  y = 28;

  // Tarikh
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tarikh: ${new Date().toLocaleDateString('ms-MY')}`, margin, y);
  y += 8;

  // Maklumat padang
  doc.setFillColor(240, 245, 255);
  doc.roundedRect(margin, y, contentW, 28, 3, 3, 'F');
  doc.setTextColor(30, 64, 175);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Maklumat Padang', margin + 4, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(9);
  doc.text(`Panjang: ${fieldLength}m   |   Lebar: ${fieldWidth}m   |   Keluasan: ${(fieldLength * fieldWidth).toLocaleString()}m²`, margin + 4, y + 14);
  doc.text(`Konfigurasi: Balapan ${trackType}m — ${trackData.lanes.length} Lorong`, margin + 4, y + 20);
  doc.setTextColor(150, 100, 0);
  doc.setFontSize(8);
  doc.text('* Ukuran padang adalah kawasan balapan sahaja, tidak termasuk kawasan khemah VIP, urusetia dan rumah sukan.', margin + 4, y + 26);
  y += 33;

  // Dimensi utama
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(9);
  doc.text(`Jejari dalam (r): ${trackData.rInner}m   |   Jejari luar: ${trackData.rOuter}m   |   Garis lurus: ${trackData.straight}m`, margin, y);
  y += 8;

  // Diagram SVG → convert ke canvas → tambah dalam PDF
  const svgString = new XMLSerializer().serializeToString(svgEl);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = function() {
    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = img.naturalHeight || 300;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0fdf4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    const imgData = canvas.toDataURL('image/png');

    const diagramH = 60;
    doc.addImage(imgData, 'PNG', margin, y, contentW, diagramH);
    y += diagramH + 5;

    // Jadual ukuran per lorong
    doc.setFillColor(79, 70, 229);
    doc.rect(margin, y, contentW, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    const colW = contentW / 4;
    doc.text('Lorong', margin + 2, y + 5);
    doc.text('Jarak', margin + colW + 2, y + 5);
    doc.text('Stagger', margin + colW * 2 + 2, y + 5);
    doc.text('Permulaan', margin + colW * 3 + 2, y + 5);
    y += 7;

    trackData.lanes.forEach((lane, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 250 : 255, 255);
      doc.rect(margin, y, contentW, 6, 'F');
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Lorong ${lane.lane}`, margin + 2, y + 4.5);
      doc.text(`${lane.distance}m`, margin + colW + 2, y + 4.5);
      doc.text(`+${lane.stagger}m`, margin + colW * 2 + 2, y + 4.5);
      doc.text(lane.start, margin + colW * 3 + 2, y + 4.5);
      y += 6;
    });

    // Nota garisan
    y += 5;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Lebar lorong: 1.22m  |  Tebal garisan: 5cm  |  Garisan permulaan & penamat: 5cm', margin, y);

    // ── HALAMAN 2 ──────────────────────────────────────────
    doc.addPage();
    y = margin;

    // Header Halaman 2
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageW, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Panduan Pembinaan Balapan', pageW / 2, 13, { align: 'center' });
    y = 28;

    // Spesifikasi teknikal
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Spesifikasi Teknikal Garisan', margin, y);
    y += 6;

    const specs = [
      'Lebar lorong: 1.21m (minimum) – 1.23m (maksimum)',
      'Tebal semua garisan: 5cm',
      'Garisan permulaan dan penamat: 5cm',
      'Garisan memotong (cut-in): 5cm',
      'Tiang penamat: tinggi 1.50m, tebal 2–3cm, lebar 5cm',
      'Bendera cut-in: tiang 1.50m, bendera 30cm × 40cm',
      'Zon pertukaran baton: 10m + 10m + 10m (jumlah 30m)'
    ];

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(9);
    specs.forEach(s => {
      doc.text(`• ${s}`, margin + 3, y);
      y += 5.5;
    });
    y += 4;

    // Keperluan Alatan
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Keperluan Alatan', margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(9);
    EQUIPMENT_LIST.forEach(item => {
      doc.text(`• ${item}`, margin + 3, y);
      y += 5.5;
    });
    y += 4;

    // Bahan-bahan
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Bahan-Bahan', margin, y);
    y += 6;

    const materials = [
      'Minyak hitam atau cat (putih)',
      'Cat semburan',
      'Minyak penipis'
    ];
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(9);
    materials.forEach(m => {
      doc.text(`• ${m}`, margin + 3, y);
      y += 5.5;
    });
    y += 4;

    // Perhatian & Peringatan
    doc.setFillColor(255, 248, 230);
    doc.roundedRect(margin, y, contentW, 5 + WARNINGS.length * 10, 3, 3, 'F');
    doc.setTextColor(180, 100, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠ Perhatian & Peringatan', margin + 4, y + 7);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 60, 0);
    doc.setFontSize(8.5);
    WARNINGS.forEach(w => {
      const lines = doc.splitTextToSize(`• ${w}`, contentW - 8);
      doc.text(lines, margin + 4, y);
      y += lines.length * 5;
    });

    // Footer
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 287, pageW, 10, 'F');
    doc.setTextColor(200, 200, 255);
    doc.setFontSize(8);
    doc.text('AthleticSketch — Berdasarkan Garis Panduan KPM, Bahagian Sukan, Kementerian Pelajaran Malaysia', pageW / 2, 293, { align: 'center' });

    // Save
    doc.save(`balapan-${trackType}m-${trackData.lanes.length}lorong.pdf`);
    URL.revokeObjectURL(svgUrl);
  };
  img.src = svgUrl;
}
```

- [ ] **Step 2: Commit**

```bash
git add public/js/pdf.js
git commit -m "feat: pdf.js — export PDF 2 halaman dengan diagram, jadual, alatan dan peringatan"
```

---

## Task 8: app.js — Wire Everything

**Files:**
- Create: `public/js/app.js`

- [ ] **Step 1: Tulis app.js**

`public/js/app.js`:
```javascript
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
    btn.className = 'w-full text-left px-3 py-2 rounded-lg text-sm border border-indigo-700 text-indigo-200 hover:bg-indigo-700 hover:text-white transition-colors';
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
    b.classList.remove('bg-indigo-600', 'text-white');
  });
  activeBtn.classList.add('bg-indigo-600', 'text-white');

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
  const svg = renderDiagram(data, track);
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
```

- [ ] **Step 2: Test dalam browser**

Buka `public/index.html`. Test:
1. Masuk panjang: `180`, lebar: `80` → klik Kira → verify ada cadangan 400m + 200m
2. Pilih `400m · 8 Lorong` → verify diagram dan jadual muncul
3. Verify stagger meningkat setiap lorong
4. Klik `Download PDF` → verify PDF dijanakan

- [ ] **Step 3: Test input validation**

Test edge cases dalam browser:
- Tinggalkan input kosong → verify error "Sila masukkan..."
- Masuk nilai negatif → verify error
- Masuk lebar > panjang → verify error
- Masuk 50 × 50 → verify error "Padang terlalu kecil"

- [ ] **Step 4: Commit**

```bash
git add public/js/app.js
git commit -m "feat: app.js — wire calculator, diagram, pdf + input validation"
```

---

## Task 9: Foundation Files + Git Push

**Files:**
- Verify semua files lengkap

- [ ] **Step 1: Verify struktur folder**

```bash
find . -not -path './node_modules/*' -not -path './.git/*' | sort
```

Expected:
```
./CLAUDE.md
./CONTEXT.md
./_headers
./docs/CONTEXT.md
./docs/plans/2026-04-14-athleticsketch-plan.md
./docs/specs/2026-04-14-athleticsketch-design.md
./package.json
./public/CONTEXT.md
./public/css/style.css
./public/index.html
./public/js/app.js
./public/js/calculator.js
./public/js/diagram.js
./public/js/pdf.js
./public/vendor/jspdf.min.js
./tests/calculator.test.js
```

- [ ] **Step 2: Run semua tests sekali lagi**

```bash
node tests/calculator.test.js
```

Expected: `7 passed, 0 failed`

- [ ] **Step 3: Buat .gitignore**

```bash
echo "node_modules/" > .gitignore
git add .gitignore
```

- [ ] **Step 4: Final commit dan push**

```bash
git add -A
git commit -m "feat: athleticsketch v1 — kalkulator balapan olahraga sekolah"
git remote add origin <repo-url>
git push -u origin test
```

- [ ] **Step 5: Verify deploy ke Cloudflare Pages**

- Pergi ke Cloudflare Pages dashboard
- Connect repo `athleticsketch`
- Set build output directory: `public`
- Deploy dari `test` branch
- Verify URL accessible dan semua features berfungsi

---

## Checklist Spec Coverage

- [x] 4 track types (150m, 200m, 300m, 400m)
- [x] Flexible lanes (4, 6, 8)
- [x] Minimum area check ikut table KPM
- [x] Formula-based calculation untuk custom field size
- [x] Standard KPM lookup untuk exact match
- [x] Diagram SVG dengan lane colors + labels
- [x] Jadual ukuran per lorong (jarak, stagger, permulaan)
- [x] PDF Halaman 1: diagram + jadual + nota padang
- [x] PDF Halaman 2: alatan + bahan + perhatian & peringatan
- [x] Info tooltip — kawasan balapan sahaja
- [x] Input validation
- [x] XSS prevention (textContent digunakan dalam app.js)
- [x] CSP headers (_headers)
- [x] jsPDF bundled (bukan CDN)
- [x] The Foundation structure (CLAUDE.md, CONTEXT.md per workspace)

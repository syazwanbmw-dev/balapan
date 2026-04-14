# AthleticSketch — Design Spec
*Tarikh: 2026-04-14 | Status: Approved*

---

## Ringkasan

AthleticSketch adalah alat kalkulator balapan olahraga untuk guru sukan sekolah. Guru masukkan saiz padang, sistem kira ukuran balapan yang sesuai, papar diagram visual dan jadual ukuran, serta boleh export sebagai PDF untuk dicetak.

- **Tiada login** — open tool, sesiapa boleh akses
- **Tiada database** — semua kira dalam browser
- **Tiada server** — pure static site
- **Rujukan rasmi** — Garis Panduan KPM (Bahagian Sukan, Kementerian Pelajaran Malaysia)

---

## Tech Stack

| Layer | Tech | Sebab |
|-------|------|-------|
| Frontend | Vanilla HTML + Tailwind CSS | Simple, no build complexity |
| Diagram | SVG (inline JS) | Scalable, print-friendly |
| PDF Export | jsPDF (bundled `/vendor/`) | Client-side, no server needed |
| Hosting | Cloudflare Pages | Free, unlimited bandwidth |
| Backend | Tiada | Semua dalam browser |

---

## Struktur Folder

```
athleticsketch/
├── CLAUDE.md              ← The Map (routing rules AI)
├── CONTEXT.md             ← Cross-workspace summary
├── public/                ← CODE room
│   ├── CONTEXT.md         ← Frontend workspace context
│   ├── index.html
│   ├── js/
│   │   ├── calculator.js  ← Formula + lookup logic
│   │   ├── diagram.js     ← SVG renderer
│   │   └── pdf.js         ← Export handler
│   ├── css/
│   │   └── style.css      ← Tailwind build
│   └── vendor/
│       └── jspdf.min.js   ← Bundled, bukan CDN
└── docs/                  ← KNOWLEDGE room
    ├── CONTEXT.md         ← Docs workspace context
    └── specs/
        └── 2026-04-14-athleticsketch-design.md
```

---

## UI Layout

Sidebar + main content (inspired by dashboard layout):

```
┌──────────────────┬─────────────────────────────────────┐
│   SIDEBAR        │  HEADER                             │
│   (240px)        │  🏃 AthleticSketch     [celikguru]  │
├──────────────────┼─────────────────────────────────────┤
│                  │                                     │
│ 📐 Saiz Padang   │   ┌─────────────────────────────┐   │
│ Panjang: [___]m  │   │                             │   │
│ Lebar:   [___]m  │   │    DIAGRAM SVG BALAPAN      │   │
│                  │   │    (skala, warna lorong,    │   │
│ 🏁 Bilangan      │   │     ukuran dilabel)         │   │
│ Lorong: [4▼]     │   │                             │   │
│                  │   └─────────────────────────────┘   │
│ [KIRA BALAPAN]   │                                     │
│                  │   ┌─────────────────────────────┐   │
│ ─────────────    │   │  JADUAL UKURAN PER LORONG   │   │
│ Cadangan:        │   │  Lorong 1: 200.00m          │   │
│ ✅ 400m · 8L     │   │  Lorong 2: 207.73m  (+7.73) │   │
│ ✅ 200m · 6L     │   │  ...                        │   │
│ ✅ 200m · 4L     │   └─────────────────────────────┘   │
│ ❌ 400m · 4L     │                                     │
│                  │   [📄 Download PDF]                 │
│ [Pilih ▶]        │                                     │
└──────────────────┴─────────────────────────────────────┘
```

**Flow UX:**
1. Guru masuk panjang × lebar padang + bilangan lorong
2. Klik **Kira Balapan** → sidebar papar semua konfigurasi yang muat
3. Guru pilih konfigurasi → diagram + jadual muncul
4. Klik **Download PDF** → export terus

---

## Track Types Yang Disokong

| Balapan | Lorong | Keluasan Minimum |
|---------|--------|-----------------|
| 400m | 8 | > 16,804.17 m² |
| 400m | 6 | > 15,482.82 m² |
| 400m | 4 | > 14,211.47 m² |
| 300m | 8 | > 10,248.86 m² |
| 300m | 6 | > 9,219.36 m² |
| 300m | 4 | > 8,239.86 m² |
| 200m | 8 | > 5,448.86 m² |
| 200m | 6 | > 4,710.18 m² |
| 200m | 4 | > 4,021.68 m² |
| 150m | 8 | > 3,548.16 m² |
| 150m | 6 | > 3,042.86 m² |
| 150m | 4 | > 2,504.17 m² |

---

## Calculation Logic

### Step 1 — Semak Keluasan
```
area = panjang × lebar
→ semak minimum area table
→ hasilkan senarai konfigurasi yang boleh muat
```

### Step 2 — Kira Dimensi (Hybrid)

**Jika padang match standard config dalam dokumen KPM:**
→ guna lookup values terus (100% tepat ikut dokumen rasmi)

**Jika padang custom size:**
```
r1 (inner radius) = (lebar_padang / 2) - margin
r2 (outer radius) = r1 + (bilangan_lorong × lebar_lorong)

Curve length:
  a = (1/3) × π × (r2 - r1)
  L_total = 4 × a

Garis lurus:
  400m: GL = 200 - (L_total / 2)
  300m: GL = 150 - (L_total / 2)
  200m: GL = 100 - (L_total / 2)
  150m: GL =  75 - (L_total / 2)

Per lorong:
  jarak_n = 2×GL + 2π×(r1 + (n - 0.5) × lebar_lorong)

Stagger:
  stagger_n = jarak_n - jarak_lorong_1
```

### Step 3 — Validate
```
✓ GL > 0 (garis lurus tidak boleh negatif)
✓ r1 ≥ minimum radius ikut dokumen
✓ 2×GL + 2×r2 ≤ panjang padang
```

---

## Output Design

### Input UI — Nota Penting

Dekat input saiz padang, papar info tooltip:

```
ℹ️  Masukkan ukuran kawasan balapan SAHAJA.
    Kawasan berikut TIDAK diambil kira:
    • Khemah VIP / Urusetia
    • Khemah rumah sukan
    • Kawasan letak kenderaan
```

### Diagram SVG
- Overhead view balapan (oval)
- Setiap lorong warna berbeza (subtle)
- Label: radius, garis lurus, lebar lorong
- Tanda garisan permulaan + stagger positions
- Skala automatik, responsive

### Jadual Ukuran

| Lorong | Jarak | Stagger | Permulaan |
|--------|-------|---------|-----------|
| 1 | 200.00m | 0.00m | Garisan T |
| 2 | 207.73m | +7.73m | 7.73m selepas T |
| 3 | 215.46m | +7.73m | 15.46m selepas T |
| ... | ... | ... | ... |

---

## PDF Export

### Halaman 1
- Header: AthleticSketch + tarikh
- Maklumat padang: panjang × lebar, keluasan
- Nota: *Ukuran padang adalah kawasan balapan sahaja, tidak termasuk kawasan khemah VIP, urusetia, rumah sukan dan kemudahan lain.*
- Konfigurasi terpilih: jenis balapan, bilangan lorong
- Diagram SVG (saiz cetak)
- Jadual ukuran per lorong

### Halaman 2
- Spesifikasi teknikal garisan:
  - Lebar lorong: 1.21m – 1.23m
  - Tebal garisan: 5cm
  - Tiang penamat: tinggi 1.50m, tebal 2–3cm, lebar 5cm
  - Bendera cut-in: tiang 1.50m, bendera 30cm × 40cm
  - Zon pertukaran baton: 10m + 10m + 10m
- Keperluan Alatan:
  - 15 batang besi penanda (30–50cm)
  - Pita ukur fibre glass 100m
  - Pita ukur steel 50m + 30m
  - Kabel/dawai 3mm (60m)
  - Tali 7–10mm (120m)
  - 20 paku 20cm
  - Minyak hitam/cat putih, cat semburan, minyak penipis
  - Roller atau berus cat 5cm
  - 10 tukul besi
- Perhatian & Peringatan:
  - Guna pita besi — pita plastik/fibre mutu rendah mengembang pada suhu tinggi
  - Besi penanda 30–50cm
  - Guna pita ukur berbeza panjang untuk mudahkan kerja

---

## Security Protocol

| Perkara | Implementasi |
|---------|-------------|
| Input validation | Nombor positif sahaja, range munasabah (max 500m) |
| XSS prevention | `textContent` bukan `innerHTML` untuk render output |
| HTTPS | Auto Cloudflare Pages |
| CSP Headers | `_headers` file dalam root public |
| Dependency | jsPDF bundled dalam `/vendor/` — bukan CDN luar |
| Data storage | Tiada — no localStorage, no cookies |

---

## Rujukan

- Garis Panduan Pengurusan Kejohanan Balapan dan Padang (Olahraga) di Sekolah
- Bahagian Sukan, Kementerian Pelajaran Malaysia
- Sumber: `C:\Users\user\Documents\Sistem\pembinaan balapan.pdf`

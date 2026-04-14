# CLAUDE.md — Balapan
*Layer 1: The Map — Routing rules untuk AI*

## Projek
- **Nama:** Balapan — Kalkulator Balapan Olahraga Sekolah
- **Domain:** Cloudflare Pages (static site)
- **Status:** Dalam pembangunan
- **Repo:** `balapan`
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
balapan/
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
Code → commit → push test → verify → merge main
```

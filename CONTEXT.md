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

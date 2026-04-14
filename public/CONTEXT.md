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

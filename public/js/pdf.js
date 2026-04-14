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
    doc.text('Perhatian & Peringatan', margin + 4, y + 7);
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

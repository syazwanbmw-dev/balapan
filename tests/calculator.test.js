// Node.js test — run: node tests/calculator.test.js
import { getValidConfigs, calculateTrack } from '../public/js/calculator.js';

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

// Padang 70m x 60m = 4,200 m² → muat 200m 4L (>4021) tapi tidak 200m 6L (>4710)
test('padang 70x60 muat 200m 4L sahaja', () => {
  const result = getValidConfigs(70, 60);
  const has200m4L = result.some(c => c.track === 200 && c.lanes === 4);
  const has200m6L = result.some(c => c.track === 200 && c.lanes === 6);
  assert(has200m4L, 'Expected 200m 4L to fit');
  assert(!has200m6L, 'Expected 200m 6L NOT to fit');
});

// Test calculateTrack untuk 200m pada padang 115x70m (standard KPM)
test('200m 8L pada padang 115x70 — lorong 1 feasible', () => {
  const result = calculateTrack(115, 70, 200, 8);
  assert(result.feasible === true, 'Expected feasible');
  assert(result.lanes[0].distance > 180 && result.lanes[0].distance < 220,
    `Expected 180-220m, got ${result.lanes[0].distance}`);
});

// Test stagger — setiap lorong mesti lebih jauh dari lorong sebelum
test('stagger mesti meningkat setiap lorong', () => {
  const result = calculateTrack(235, 100, 400, 8);
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
  const result = calculateTrack(235, 100, 400, 8);
  assert(result.straight > 0, `Expected positive straight, got ${result.straight}`);
});

// Test padang terlalu sempit — tidak feasible
test('padang terlalu kecil untuk 400m — tidak feasible', () => {
  const result = calculateTrack(50, 40, 400, 4);
  assert(result.feasible === false, 'Expected not feasible');
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);

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

// Padang 70m x 60m = 4,200 m² → muat 200m 4L (>4021) tapi tidak 200m 6L (>4710)
test('padang 70x60 muat 200m 4L sahaja', () => {
  const result = getValidConfigs(70, 60);
  const has200m4L = result.some(c => c.track === 200 && c.lanes === 4);
  const has200m6L = result.some(c => c.track === 200 && c.lanes === 6);
  assert(has200m4L, 'Expected 200m 4L to fit');
  assert(!has200m6L, 'Expected 200m 6L NOT to fit');
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);

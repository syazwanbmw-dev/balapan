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

// Garis lurus target (meter) untuk setiap jenis balapan
const STRAIGHT_TARGET = {
  400: 200,
  300: 150,
  200: 100,
  150: 75
};

// Standard configs dari dokumen KPM
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
    rInner = stdMatch.rInner;
    rOuter = stdMatch.rOuter;
    straight = stdMatch.straight;
  } else {
    const margin = 2.0;
    rOuter = (fieldWidth / 2) - margin;
    rInner = rOuter - (lanes * LANE_WIDTH);

    if (rInner <= 0) return { feasible: false };

    const rMid = rInner + (lanes * LANE_WIDTH / 2);
    const totalCurve = 2 * Math.PI * rMid;

    straight = STRAIGHT_TARGET[track] - (totalCurve / 2);

    if (straight <= 0) return { feasible: false };

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

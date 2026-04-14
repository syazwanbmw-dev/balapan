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

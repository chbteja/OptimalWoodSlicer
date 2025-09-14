import { calculateCuttingPlan } from './cuttingAlgorithm.js';

function testCutting(plank, pieces, shouldFit, label, wasteCheck) {
  let passed = false;
  try {
    const result = calculateCuttingPlan(plank, pieces);
    if (!shouldFit) {
      console.error(`❌ [${label}] Expected to fail, but succeeded.`);
    } else {
      // Waste area checks
      if (wasteCheck) {
        const { wasteArea } = getWasteStats(plank, result.placed);
        if (wasteCheck.wasteArea !== undefined && wasteArea !== wasteCheck.wasteArea) {
          console.error(`❌ [${label}] Waste area: expected ${wasteCheck.wasteArea}, got ${wasteArea}`);
          return;
        }
      }
      passed = true;
    }
  } catch (e) {
    if (shouldFit) {
      console.error(`❌ [${label}] Expected to fit, but failed: ${e.message}`);
    } else {
      passed = true;
    }
  }
  if (passed) {
    console.log(`✅ [${label}]`);
  }
}

function getWasteStats(plank, placed) {
  if (!placed || !placed.length) {
    return { wasteArea: plank.width * plank.height };
  }
  const usedArea = placed.reduce((sum, p) => sum + p.width * p.height, 0);
  const wasteArea = plank.width * plank.height - usedArea;
  return { wasteArea };
}

// Test cases
const tests = [
  {
    plank: { width: 2400, height: 1200 },
    pieces: [ { width: 600, height: 400, quantity: 6 }, { width: 300, height: 600, quantity: 3 } ],
    shouldFit: true,
    label: '6x 600x400 + 3x 300x600 in 2400x1200 (should fit)',
    wasteCheck: { wasteArea: 0 },
  },
  {
    plank: { width: 2400, height: 1200 },
    pieces: [ { width: 600, height: 400, quantity: 7 }, { width: 300, height: 600, quantity: 3 } ],
    shouldFit: true,
    label: '7x 600x400 + 3x 300x600 in 2400x1200 (should fit)',
    wasteCheck: { wasteArea: 0 },
  },
  {
    plank: { width: 2400, height: 1200 },
    pieces: [ { width: 600, height: 400, quantity: 12 } ],
    shouldFit: true,
    label: '12x 600x400 in 2400x1200 (should fit)',
    wasteCheck: { wasteArea: 0 },
  },
  {
    plank: { width: 2400, height: 1200 },
    pieces: [ { width: 600, height: 400, quantity: 13 } ],
    shouldFit: false,
    label: '13x 600x400 in 2400x1200 (should NOT fit)',
  },
  {
    plank: { width: 2400, height: 1200 },
    pieces: [ { width: 600, height: 400, quantity: 8 }, { width: 300, height: 600, quantity: 3 } ],
    shouldFit: false,
    label: '8x 600x400 + 3x 300x600 in 2400x1200 (should NOT fit)',
  },
  {
    plank: { width: 2400, height: 1200 },
    pieces: [ { width: 1200, height: 600, quantity: 4 } ],
    shouldFit: true,
    label: '4x 1200x600 in 2400x1200 (should fit)',
    wasteCheck: { wasteArea: 0 },
  },
  {
    plank: { width: 2400, height: 1200 },
    pieces: [ { width: 2400, height: 1200, quantity: 1 } ],
    shouldFit: true,
    label: '1x 2400x1200 in 2400x1200 (should fit)',
    wasteCheck: { wasteArea: 0 },
  },
  {
    plank: { width: 2400, height: 1200 },
    pieces: [ { width: 2401, height: 1200, quantity: 1 } ],
    shouldFit: false,
    label: '1x 2401x1200 in 2400x1200 (should NOT fit)',
  },
  {
    plank: { width: 2400, height: 1200 },
    pieces: [ { width: 2400, height: 1201, quantity: 1 } ],
    shouldFit: false,
    label: '1x 2400x1201 in 2400x1200 (should NOT fit)',
  },
  // Partial fit: 2x 1200x600 in 2400x1200, should have 1/2 waste
  {
    plank: { width: 2400, height: 1200 },
    pieces: [ { width: 1200, height: 600, quantity: 2 } ],
    shouldFit: true,
    label: '2x 1200x600 in 2400x1200 (should fit, 1/2 waste)',
    wasteCheck: { wasteArea: 1200*600*2 },
  },
];

tests.forEach(t => testCutting(t.plank, t.pieces, t.shouldFit, t.label, t.wasteCheck));

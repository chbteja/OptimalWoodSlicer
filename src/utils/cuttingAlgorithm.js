// MaxRects with rotation and hybrid permutation for small N
export function calculateCuttingPlan(plank, pieces) {
  // Expand pieces by quantity
  const expanded = [];
  pieces.forEach((p, i) => {
    for (let q = 0; q < p.quantity; q++) {
      expanded.push({ width: p.width, height: p.height, index: i });
    }
  });
  // Check for any piece too large for the plank (in either orientation)
  for (const piece of expanded) {
    if ((piece.width > plank.width && piece.height > plank.width) ||
        (piece.height > plank.height && piece.width > plank.height)) {
      throw new Error('A piece is too large for the plank!');
    }
  }
  // For small N, try all permutations and all orientation combinations
  if (expanded.length <= 7) {
    const perms = getPermutations(expanded);
    for (const perm of perms) {
      const orientationCombos = getOrientationCombos(perm.length);
      for (const orientations of orientationCombos) {
        try {
          return tryMaxRectsWithRotation(plank, perm, orientations, true);
        } catch (e) {
          // Try next
        }
      }
    }
    throw new Error('Not all pieces fit on the plank!');
  } else {
    // For large N, greedy MaxRects with rotation
    return tryMaxRectsWithRotation(plank, expanded, null, true);
  }
}

function tryMaxRectsWithRotation(plank, expanded, orientations, returnFreeRects) {
  let freeRects = [ { x: 0, y: 0, width: plank.width, height: plank.height } ];
  let placed = [];
  let pieceCounts = {};
  for (let idx = 0; idx < expanded.length; idx++) {
    const piece = expanded[idx];
    let bestIdx = -1;
    let bestScore = Infinity;
    let bestRect = null;
    let bestRotated = false;
    // Try both orientations
    for (let i = 0; i < freeRects.length; i++) {
      const rect = freeRects[i];
      // Try original
      if (piece.width <= rect.width && piece.height <= rect.height) {
        const leftover = (rect.width - piece.width) * rect.height + rect.width * (rect.height - piece.height);
        if (leftover < bestScore && (!orientations || !orientations[idx])) {
          bestScore = leftover;
          bestIdx = i;
          bestRect = rect;
          bestRotated = false;
        }
      }
      // Try rotated
      if (piece.height <= rect.width && piece.width <= rect.height) {
        const leftover = (rect.width - piece.height) * rect.height + rect.width * (rect.height - piece.width);
        if (leftover < bestScore && (!orientations || orientations[idx])) {
          bestScore = leftover;
          bestIdx = i;
          bestRect = rect;
          bestRotated = true;
        }
      }
    }
    if (bestIdx === -1) {
      throw new Error('Not all pieces fit on the plank!');
    }
    const w = bestRotated ? piece.height : piece.width;
    const h = bestRotated ? piece.width : piece.height;
    pieceCounts[piece.index] = (pieceCounts[piece.index] || 0) + 1;
    placed.push({
      x: bestRect.x,
      y: bestRect.y,
      width: w,
      height: h,
      index: piece.index,
      count: pieceCounts[piece.index],
      rotated: bestRotated,
    });
    const newRects = [];
    if (bestRect.width - w > 0) {
      newRects.push({
        x: bestRect.x + w,
        y: bestRect.y,
        width: bestRect.width - w,
        height: h,
      });
    }
    if (bestRect.height - h > 0) {
      newRects.push({
        x: bestRect.x,
        y: bestRect.y + h,
        width: bestRect.width,
        height: bestRect.height - h,
      });
    }
    freeRects.splice(bestIdx, 1);
    freeRects = freeRects.concat(newRects);
    freeRects = pruneFreeRects(freeRects);
  }
  if (returnFreeRects) {
    return { placed, freeRects };
  } else {
    return placed;
  }
}

function pruneFreeRects(rects) {
  return rects.filter((a, i) =>
    !rects.some((b, j) => i !== j && containsRect(b, a))
  );
}
function containsRect(a, b) {
  return (
    b.x >= a.x &&
    b.y >= a.y &&
    b.x + b.width <= a.x + a.width &&
    b.y + b.height <= a.y + a.height
  );
}
// Heap's algorithm for permutations
function getPermutations(arr) {
  const results = [];
  function permute(a, n) {
    if (n === 1) {
      results.push(a.slice());
      return;
    }
    for (let i = 0; i < n; i++) {
      permute(a, n - 1);
      const j = n % 2 === 0 ? i : 0;
      [a[n - 1], a[j]] = [a[j], a[n - 1]];
    }
  }
  permute(arr.slice(), arr.length);
  return results;
}
// Generate all orientation combinations for n pieces (false=original, true=rotated)
function getOrientationCombos(n) {
  const combos = [];
  const total = 1 << n;
  for (let i = 0; i < total; i++) {
    const arr = [];
    for (let j = 0; j < n; j++) {
      arr.push(Boolean((i >> j) & 1));
    }
    combos.push(arr);
  }
  return combos;
}

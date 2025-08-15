/**
 * Check if a point is within a stroke path with given width
 */
export const isPointInStroke = (
  x: number, 
  y: number, 
  strokePoints: number[], 
  strokeWidth: number
): boolean => {
  if (strokePoints.length < 4) return false;

  const halfWidth = strokeWidth / 2;

  // Check each line segment in the stroke
  for (let i = 0; i < strokePoints.length - 2; i += 2) {
    const x1 = strokePoints[i];
    const y1 = strokePoints[i + 1];
    const x2 = strokePoints[i + 2];
    const y2 = strokePoints[i + 3];

    const distance = distanceToLineSegment(x, y, x1, y1, x2, y2);
    if (distance <= halfWidth) {
      return true;
    }
  }

  return false;
};

/**
 * Calculate distance from point to line segment
 */
const distanceToLineSegment = (
  px: number, py: number,
  x1: number, y1: number,
  x2: number, y2: number
): number => {
  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  if (lenSq === 0) {
    // Line segment is a point
    return Math.sqrt(A * A + B * B);
  }

  let param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;
  
  return Math.sqrt(dx * dx + dy * dy);
};
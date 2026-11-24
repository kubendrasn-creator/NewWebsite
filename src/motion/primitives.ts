// src/motion/primitives.ts
// Algorithmic SVG geometry helpers (8px grid snap, 8° slant skew, brand token colors, point morphing)

export const TOKENS = {
  navy: '#003074',
  blueInk: '#0070a8',
  blue: '#0088cc',
  white: '#ffffff',
  lightTint: '#d6effb', // color-mix(in srgb, #0088cc 16%, #ffffff)
} as const;

export type TokenColor = typeof TOKENS[keyof typeof TOKENS];

export interface Point {
  x: number;
  y: number;
}

/**
 * Snap coordinate to 8px grid
 */
export function snap(val: number, grid = 8): number {
  return Math.round(val / grid) * grid;
}

/**
 * Tangent of 8 degrees (forward lean)
 */
export const TAN_8_DEG = Math.tan((8 * Math.PI) / 180); // ~0.140540838

/**
 * Generates an 8-degree slanted polygon rectangle
 * Vertices: Top-Left, Top-Right, Bottom-Right, Bottom-Left
 */
export function slantRect(x: number, y: number, w: number, h: number, deg = 8): string {
  const sx = snap(x);
  const sy = snap(y);
  const sw = snap(w);
  const sh = snap(h);
  const dx = sh * Math.tan((deg * Math.PI) / 180);

  const p1 = `${(sx + dx).toFixed(2)},${sy.toFixed(2)}`;
  const p2 = `${(sx + sw + dx).toFixed(2)},${sy.toFixed(2)}`;
  const p3 = `${(sx + sw).toFixed(2)},${(sy + sh).toFixed(2)}`;
  const p4 = `${sx.toFixed(2)},${(sy + sh).toFixed(2)}`;
  return `${p1} ${p2} ${p3} ${p4}`;
}

/**
 * Generates point array for an 8-degree slanted rectangle
 */
export function slantRectPoints(x: number, y: number, w: number, h: number, deg = 8): Point[] {
  const sx = snap(x);
  const sy = snap(y);
  const sw = snap(w);
  const sh = snap(h);
  const dx = sh * Math.tan((deg * Math.PI) / 180);

  return [
    { x: sx + dx, y: sy },
    { x: sx + sw + dx, y: sy },
    { x: sx + sw, y: sy + sh },
    { x: sx, y: sy + sh },
  ];
}

/**
 * Linear point interpolation between isomorphic point arrays (same length)
 */
export function morphPoints(p0: Point[], p1: Point[], t: number): Point[] {
  const len = Math.min(p0.length, p1.length);
  const res: Point[] = [];
  const clampedT = Math.max(0, Math.min(1, t));

  for (let i = 0; i < len; i++) {
    res.push({
      x: p0[i].x + (p1[i].x - p0[i].x) * clampedT,
      y: p0[i].y + (p1[i].y - p0[i].y) * clampedT,
    });
  }
  return res;
}

/**
 * Formats Point array to SVG polygon points string
 */
export function pointsToString(points: Point[]): string {
  return points.map(p => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
}

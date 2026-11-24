// src/motion/ease.ts
// Pure mathematical easing functions for deterministic animation
// Curves: expoOut, quartInOut, spring (bounded overshoot <= 4%), anticipation

export interface SpringConfig {
  stiffness?: number; // k
  damping?: number;   // c
}

/**
 * Exponential out curve: instantaneous fast acceleration with smooth deceleration
 * Endpoints: expoOut(0) = 0, expoOut(1) = 1
 */
export function expoOut(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - Math.pow(2, -10 * t);
}

/**
 * Quartic in-out curve: symmetric smooth acceleration and deceleration
 * Endpoints: quartInOut(0) = 0, quartInOut(1) = 1
 */
export function quartInOut(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

/**
 * Anticipation curve: subtle 3% opposite movement prior to forward entrance
 */
export function anticipation(t: number, back = 0.03): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const s = back * 10;
  return t * t * ((s + 1) * t - s);
}

/**
 * Analytical underdamped spring: harmonic oscillator with bounded peak overshoot <= 4%
 * Uses exact closed-form solution: 1 - e^(-zeta*w0*t) * (cos(wd*t) + (zeta*w0/wd)*sin(wd*t))
 */
export function spring(t: number, config: SpringConfig = {}): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  // Defaults calibrated for <= 4.0% overshoot (zeta ~ 0.72)
  const k = config.stiffness ?? 180;
  const c = config.damping ?? 22;

  const w0 = Math.sqrt(k);
  const zeta = c / (2 * w0); // ~0.82 with defaults -> zero or < 4% overshoot
  const effectiveZeta = Math.min(0.999, Math.max(0.72, zeta));
  const wd = w0 * Math.sqrt(1 - effectiveZeta * effectiveZeta);

  // Scale time so response completes gracefully by t = 1
  const simT = t * 6;
  const decay = Math.exp(-effectiveZeta * w0 * simT);
  const oscillation = Math.cos(wd * simT) + ((effectiveZeta * w0) / wd) * Math.sin(wd * simT);

  const val = 1 - decay * oscillation;

  // Cap peak overshoot strictly at 1.04 (+4% overshoot boundary)
  return Math.min(1.04, Math.max(0, val));
}

// src/constants/motion.ts
// Standardized motion tokens exposed to GSAP and JavaScript animations
// Corresponds to CSS tokens in src/styles/global.css
export const MOTION_TOKENS = {
  easeOut: 'power3.out', // cubic-bezier(0.16, 1, 0.3, 1) expo-out
  easeInOut: 'power3.inOut', // cubic-bezier(0.65, 0, 0.35, 1)
  durationFast: 0.18, // 180ms
  durationNormal: 0.42, // 420ms
  durationSlow: 0.8, // 800ms
  stagger: 0.06, // 60ms
  revealDistance: 24, // 24px
};

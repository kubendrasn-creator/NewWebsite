// src/scripts/hero-webgl.ts
// Lazy-loaded WebGL shader background using OGL in logo colors (#0088cc, #003074, #eef7fd)
import { Renderer, Program, Mesh, Triangle } from 'ogl';

export function initHeroShader(canvas: HTMLCanvasElement) {
  // Check browser capability & user constraints
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;
  const lowConcurrency = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency < 4;
  const saveData = (navigator as any).connection?.saveData === true;

  if (prefersReduced || isMobile || lowConcurrency || saveData) {
    return null;
  }

  let renderer: any;
  try {
    renderer = new Renderer({ canvas, alpha: true, depth: false, antialias: true });
  } catch (e) {
    return null;
  }

  const gl = renderer.gl;
  gl.clearColor(1, 1, 1, 0);

  const geometry = new Triangle(gl);

  const vertex = /* glsl */ `
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragment = /* glsl */ `
    precision highp float;
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform float uScroll;
    varying vec2 vUv;

    // Logo color palette
    // Brand Navy: #003074 -> vec3(0.0, 0.188, 0.455)
    // Brand Blue: #0088cc -> vec3(0.0, 0.533, 0.8)
    // Brand Ice:  #eef7fd -> vec3(0.933, 0.969, 0.992)
    // White:      #ffffff -> vec3(1.0, 1.0, 1.0)

    vec3 brandNavy = vec3(0.0, 0.188, 0.455);
    vec3 brandBlue = vec3(0.0, 0.533, 0.8);
    vec3 brandIce  = vec3(0.933, 0.969, 0.992);
    vec3 brandWhite= vec3(1.0, 1.0, 1.0);

    // Simple pseudo-random & smooth simplex-like noise
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    void main() {
      vec2 st = gl_FragCoord.xy / uResolution.xy;
      st.y = 1.0 - st.y;

      vec2 mouseNorm = uMouse / uResolution;
      vec2 offset = (st - mouseNorm) * 0.15;

      float t = uTime * 0.35 + uScroll * 0.001;

      // Layered sine & noise flow resembling the forward-slanted 'i' swoosh
      float n1 = noise(st * 2.5 + vec2(t * 0.5, t * 0.2) + offset);
      float n2 = noise(st * 4.0 - vec2(t * 0.3, t * 0.4));

      float wave = sin((st.x * 2.0 + st.y * 1.5 - t * 0.8) + (n1 * 1.5)) * 0.5 + 0.5;
      wave = smoothstep(0.15, 0.85, wave * n2);

      // Mix palette strictly: mostly white / brand-ice with flowing ribbons of brand-blue & deep navy hints
      vec3 col = mix(brandWhite, brandIce, st.y);
      col = mix(col, brandBlue, wave * 0.28);
      col = mix(col, brandNavy, wave * n1 * 0.12);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: [gl.canvas.width, gl.canvas.height] },
      uMouse: { value: [gl.canvas.width * 0.5, gl.canvas.height * 0.5] },
      uScroll: { value: window.scrollY || 0 },
    },
  });

  const mesh = new Mesh(gl, { geometry, program });

  function resize() {
    const width = canvas.parentElement?.clientWidth || window.innerWidth;
    const height = canvas.parentElement?.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    program.uniforms.uResolution.value = [width, height];
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  window.addEventListener('mousemove', (e) => {
    program.uniforms.uMouse.value = [e.clientX, e.clientY];
  }, { passive: true });

  window.addEventListener('scroll', () => {
    program.uniforms.uScroll.value = window.scrollY;
  }, { passive: true });

  let animationFrameId: number;
  let lastTime = performance.now();

  function update(currentTime: number) {
    animationFrameId = requestAnimationFrame(update);
    const dt = (currentTime - lastTime) * 0.001;
    lastTime = currentTime;
    program.uniforms.uTime.value += dt;
    renderer.render({ scene: mesh });
  }

  animationFrameId = requestAnimationFrame(update);

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resize);
  };
}

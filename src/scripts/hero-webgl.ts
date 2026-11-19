// src/scripts/hero-webgl.ts
// OGL WebGL aurora/mesh shader for hero background.
// Rules: DPR capped at 1.5, renders at 0.75 scale on large screens,
// pauses when hero is offscreen (IntersectionObserver) or tab is hidden.
import { Renderer, Program, Mesh, Triangle } from 'ogl';

export function initHeroShader(canvas: HTMLCanvasElement) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile       = window.innerWidth < 768;
  const lowCPU         = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency < 4;
  const saveData       = (navigator as any).connection?.saveData === true;

  if (prefersReduced || isMobile || lowCPU || saveData) return null;

  let renderer: any = null;
  try {
    renderer = new Renderer({ canvas, alpha: true, depth: false, antialias: false });
  } catch {
    return null;
  }
  const gl = renderer.gl;
  gl.clearColor(1, 1, 1, 0);

  const geometry = new Triangle(gl);

  const vertex = /* glsl */`
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragment = /* glsl */`
    precision mediump float;
    uniform float uTime;
    uniform vec2  uResolution;
    uniform vec2  uMouse;
    varying vec2  vUv;

    // Brand palette (hex → linear float)
    // #003074 → vec3(0.000, 0.188, 0.455)
    // #0088cc → vec3(0.000, 0.533, 0.800)
    // #eef7fd → vec3(0.933, 0.969, 0.992)
    // #ffffff → vec3(1.000, 1.000, 1.000)

    float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p), u=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
                 mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
    }

    void main(){
      vec2 st = gl_FragCoord.xy / uResolution;
      st.y = 1.0 - st.y;

      float t  = uTime * 0.3;
      float n1 = noise(st * 2.2 + vec2(t * 0.4, t * 0.15));
      float n2 = noise(st * 3.8 - vec2(t * 0.25, t * 0.35));
      float wave = sin((st.x * 1.8 + st.y * 1.3 - t * 0.7) + n1 * 1.2) * 0.5 + 0.5;
      wave = smoothstep(0.2, 0.8, wave * n2);

      vec3 col = mix(vec3(1.0), vec3(0.933,0.969,0.992), st.y);
      col = mix(col, vec3(0.0,0.533,0.8),  wave * 0.22);
      col = mix(col, vec3(0.0,0.188,0.455), wave * n1 * 0.09);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime:       { value: 0 },
      uResolution: { value: [gl.canvas.width, gl.canvas.height] },
      uMouse:      { value: [gl.canvas.width * 0.5, gl.canvas.height * 0.5] },
    },
  });

  const mesh = new Mesh(gl, { geometry, program });

  // --- Sizing: cap DPR at 1.5, render at 0.75 on large screens -----------
  const isLarge = window.innerWidth > 1200;

  function resize() {
    const container = canvas.parentElement;
    const w = container ? container.clientWidth  : window.innerWidth;
    const h = container ? container.clientHeight : window.innerHeight;
    const renderScale = isLarge ? 0.75 : 1.0;
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    renderer.setSize(w * renderScale, h * renderScale);
    // Display at full CSS size (GPU upscale — fine for bg)
    canvas.style.width  = `${w}px`;
    canvas.style.height = `${h}px`;
    program.uniforms.uResolution.value = [w * renderScale * dpr, h * renderScale * dpr];
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  window.addEventListener('mousemove', (e) => {
    program.uniforms.uMouse.value = [e.clientX, e.clientY];
  }, { passive: true });

  // --- Render loop with pause support ------------------------------------
  let rafId: number;
  let paused = false;

  function tick(now: number) {
    if (!paused) {
      program.uniforms.uTime.value = now * 0.001;
      renderer.render({ scene: mesh });
    }
    rafId = requestAnimationFrame(tick);
  }

  // Pause when hero is offscreen
  const obs = new IntersectionObserver(
    ([entry]) => { paused = !entry.isIntersecting; },
    { threshold: 0 }
  );
  obs.observe(canvas);

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
  });

  rafId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(rafId);
    obs.disconnect();
    window.removeEventListener('resize', resize);
  };
}

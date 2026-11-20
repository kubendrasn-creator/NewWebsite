// src/scripts/motion.ts
// ULTRA-FAST NATIVE MOTION & LIFECYCLE ENGINE for Astro ClientRouter
// - 100% Native Browser Scrolling: 0ms latency, 120Hz/60Hz hardware accelerated, zero wheel drag.
// - Zero Pin Locking: No scroll traps, no stuck frames, no freezing on scroll.
// - Clean per-page lifecycle: initPage() on 'astro:page-load', destroyPage() on 'astro:before-swap'

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __apt_lenis?: any | null;
    __apt_cursor_init?: boolean;
    __apt_global_init?: boolean;
    __perf?: {
      scrollTriggers: () => number;
      lenisInstances: number;
      cursorInstances: number;
    };
  }
}

// ─── 1. GLOBAL SINGLETONS ───────────────────────────────────────────────────
function initGlobalSingletons() {
  if (typeof window === 'undefined' || window.__apt_global_init) return;
  window.__apt_global_init = true;

  // Let browser manage scroll restoration naturally
  history.scrollRestoration = 'auto';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.innerWidth >= 1024 && window.matchMedia('(hover: hover)').matches;

  // Native Scroll: Zero lag, instantaneous response
  window.__apt_lenis = null;

  // Update ScrollTrigger on native scroll
  window.addEventListener('scroll', () => {
    ScrollTrigger.update();
  }, { passive: true });

  // Persistent Custom Cursor
  if (!prefersReduced && isDesktop) {
    initCursor();
    window.__apt_cursor_init = true;
  }

  // Expose __perf metrics for verification & tests
  window.__perf = {
    scrollTriggers: () => ScrollTrigger.getAll().length,
    lenisInstances: 0,
    cursorInstances: window.__apt_cursor_init ? 1 : 0,
  };
}

// ─── 2. CUSTOM CURSOR ────────────────────────────────────────────────────────
function initCursor() {
  if (document.getElementById('cursor-dot')) return;

  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.id = 'cursor-dot';
  ring.id = 'cursor-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');

  Object.assign(dot.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#0070a8',
    pointerEvents: 'none',
    zIndex: '10001',
    transform: 'translate3d(-100px,-100px,0)',
    willChange: 'transform',
    opacity: '0',
  });

  const ringLabel = document.createElement('span');
  ringLabel.id = 'cursor-ring-label';
  Object.assign(ringLabel.style, {
    position: 'absolute',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '800',
    color: '#0070a8',
    opacity: '0',
    transition: 'opacity 0.15s',
    letterSpacing: '0.08em',
    userSelect: 'none',
  });
  ringLabel.textContent = 'View';

  Object.assign(ring.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1.5px solid #0070a8',
    pointerEvents: 'none',
    zIndex: '10000',
    transform: 'translate3d(-100px,-100px,0)',
    willChange: 'transform',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'width 0.2s ease, height 0.2s ease, background-color 0.15s, opacity 0.2s',
    opacity: '0',
  });
  ring.appendChild(ringLabel);

  document.body.appendChild(dot);
  document.body.appendChild(ring);
  document.documentElement.classList.add('has-custom-cursor');

  let initialized = false;
  const qDotX = gsap.quickTo(dot, 'x', { duration: 0.02 });
  const qDotY = gsap.quickTo(dot, 'y', { duration: 0.02 });
  const qRingX = gsap.quickTo(ring, 'x', { duration: 0.15, ease: 'power2.out' });
  const qRingY = gsap.quickTo(ring, 'y', { duration: 0.15, ease: 'power2.out' });

  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

  window.addEventListener('mousemove', (e) => {
    if (!initialized) {
      initialized = true;
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    }
    qDotX(e.clientX);
    qDotY(e.clientY);
    qRingX(e.clientX);
    qRingY(e.clientY);
  }, { passive: true });

  // Delegated states
  document.addEventListener('mouseover', (e) => {
    const target = e.target as Element;
    if (!target) return;
    const viewCard = target.closest('[data-cursor="view"]');
    const isLink = target.closest('a, button, [role="button"]');
    const isInput = target.closest('input, textarea, select, [contenteditable="true"]');

    if (isInput) {
      ring.style.opacity = '0';
      dot.style.opacity = '0';
    } else if (viewCard) {
      ring.style.opacity = '1';
      dot.style.opacity = '1';
      gsap.to(ring, { width: 72, height: 72, duration: 0.2, ease: 'power2.out' });
      ring.style.backgroundColor = 'rgba(0,112,168,0.08)';
      ring.style.borderColor = '#0070a8';
      ringLabel.style.opacity = '1';
    } else if (isLink) {
      ring.style.opacity = '1';
      dot.style.opacity = '1';
      gsap.to(ring, { width: 50, height: 50, duration: 0.2, ease: 'power2.out' });
      ring.style.backgroundColor = 'rgba(0,136,204,0.10)';
      ring.style.borderColor = '#0088cc';
      ringLabel.style.opacity = '0';
    } else {
      ring.style.opacity = '1';
      dot.style.opacity = '1';
      gsap.to(ring, { width: 36, height: 36, duration: 0.2, ease: 'power2.out' });
      ring.style.backgroundColor = 'transparent';
      ring.style.borderColor = '#0070a8';
      ringLabel.style.opacity = '0';
    }
  });

  document.addEventListener('mousedown', () => {
    gsap.to([dot, ring], { scale: 0.85, duration: 0.08 });
  });
  document.addEventListener('mouseup', () => {
    gsap.to([dot, ring], { scale: 1, duration: 0.15 });
  });
  document.addEventListener('mouseleave', () => {
    gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
  });
  document.addEventListener('mouseenter', () => {
    if (initialized) gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
  });
  window.addEventListener('blur', () => {
    gsap.set([dot, ring], { opacity: 0 });
  });
}

// ─── 3. PER-PAGE LIFECYCLE ───────────────────────────────────────────────────
let currentPageContext: gsap.Context | null = null;
let pageCleanups: Array<() => void> = [];

export function destroyPage() {
  if (currentPageContext) {
    currentPageContext.revert();
    currentPageContext = null;
  }
  while (pageCleanups.length > 0) {
    const fn = pageCleanups.pop();
    try { fn?.(); } catch (e) {}
  }

  // Reset custom cursor hover state
  const ring = document.getElementById('cursor-ring');
  const ringLabel = document.getElementById('cursor-ring-label');
  if (ring) {
    gsap.set(ring, { width: 36, height: 36, scale: 1 });
    ring.style.backgroundColor = 'transparent';
    ring.style.borderColor = '#0070a8';
  }
  if (ringLabel) {
    ringLabel.style.opacity = '0';
  }
}

export function initPage() {
  initGlobalSingletons();
  destroyPage();

  const headerEl = document.getElementById('site-header');
  const headerH = headerEl?.offsetHeight || 72;
  document.documentElement.style.setProperty('--header-h', `${headerH}px`);

  currentPageContext = gsap.context(() => {
    const mm = gsap.matchMedia();

    // ── Desktop (>= 1024px, hover: hover, no reduced-motion) ────────────────
    mm.add('(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)', () => {
      
      // 1. Header shrink on scroll
      if (headerEl) {
        ScrollTrigger.create({
          start: 'top -50',
          end: 99999,
          onUpdate: (self) => {
            if (self.progress > 0) {
              headerEl.classList.add('header-scrolled');
              headerEl.classList.remove('header-top');
            } else {
              headerEl.classList.add('header-top');
              headerEl.classList.remove('header-scrolled');
            }
          },
        });
      }

      // 2. Hero kinetic reveal: Fast and instantaneous (0 lag)
      const heroHeadline = document.querySelector('.hero-kinetic-headline');
      if (heroHeadline) {
        const words = heroHeadline.querySelectorAll<HTMLElement>('.word-inner');
        if (words.length) {
          gsap.fromTo(words, 
            { yPercent: 40, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: 'power2.out' }
          );
        }
      }

      // 3. Why Apt Vertical Centered Scenes (/why-apt/)
      const whyScenes = document.querySelectorAll<HTMLElement>('.why-apt-scene');
      whyScenes.forEach((scene) => {
        const contentBox = scene.querySelector<HTMLElement>('.scene-content-box');
        if (contentBox) {
          gsap.fromTo(contentBox,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: scene,
                start: 'top 75%',
                once: true,
              },
            }
          );
        }
      });

      // 4. About Narrative Word Reveal (/about/)
      const aboutWords = document.querySelectorAll<HTMLElement>('.about-reveal-word');
      const narrativeEl = document.getElementById('about-narrative');
      if (aboutWords.length && narrativeEl) {
        gsap.fromTo(aboutWords,
          { color: '#0070a8' },
          {
            color: '#003074',
            stagger: 0.015,
            ease: 'none',
            scrollTrigger: {
              trigger: narrativeEl,
              start: 'top 70%',
              end: 'center 45%',
              scrub: 0.3,
            },
          }
        );
      }

      // 5. Delivery Route Arc Draw
      const routePath = document.getElementById('delivery-route-svg-path') as SVGPathElement | null;
      const pulseDot = document.getElementById('delivery-pulse-dot');
      if (routePath) {
        const len = routePath.getTotalLength();
        gsap.set(routePath, { strokeDasharray: len, strokeDashoffset: len });
        ScrollTrigger.create({
          trigger: '#delivery',
          start: 'top 70%',
          end: 'center 45%',
          scrub: 0.3,
          onUpdate: (self) => {
            gsap.set(routePath, { strokeDashoffset: len * (1 - self.progress) });
            if (pulseDot) {
              const pt = routePath.getPointAtLength(len * self.progress);
              gsap.set(pulseDot, { attr: { cx: pt.x, cy: pt.y } });
            }
          },
        });
      }

      // 6. Magnetic Buttons: Ultra responsive
      document.querySelectorAll<HTMLElement>('.magnetic-btn').forEach((btn) => {
        const onMove = (e: MouseEvent) => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.2;
          const y = (e.clientY - r.top - r.height / 2) * 0.2;
          gsap.to(btn, { x, y, duration: 0.18, ease: 'power2.out', overwrite: true });
        };
        const onLeave = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.3, ease: 'power2.out', overwrite: true });
        };
        btn.addEventListener('mousemove', onMove, { passive: true });
        btn.addEventListener('mouseleave', onLeave);
        pageCleanups.push(() => {
          btn.removeEventListener('mousemove', onMove);
          btn.removeEventListener('mouseleave', onLeave);
        });
      });

    });

    // ── Generic Reveals (All Viewports) ─────────────────────────────────────
    ScrollTrigger.batch('.reveal-up', {
      onEnter: (batch) => {
        gsap.fromTo(batch, 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.05 }
        );
      },
      once: true,
      start: 'top 85%',
    });

  });

  // ── Bug Fix A: Independently Expandable Accordion (/about/) ─────────────────
  const toggles = document.querySelectorAll<HTMLButtonElement>('.benefit-card-toggle');
  toggles.forEach((btn) => {
    const targetId = btn.getAttribute('aria-controls');
    if (!targetId) return;
    const panel = document.getElementById(targetId);
    const chevron = btn.querySelector('.benefit-chevron');
    if (!panel) return;

    const onToggle = () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      panel.classList.toggle('is-open', !isExpanded);
      chevron?.classList.toggle('is-open', !isExpanded);
    };

    const onTransitionEnd = () => {
      ScrollTrigger.refresh();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        onToggle();
      }
    };

    btn.addEventListener('click', onToggle);
    panel.addEventListener('transitionend', onTransitionEnd);
    btn.addEventListener('keydown', onKeyDown);

    pageCleanups.push(() => {
      btn.removeEventListener('click', onToggle);
      panel.removeEventListener('transitionend', onTransitionEnd);
      btn.removeEventListener('keydown', onKeyDown);
    });
  });

  // ── Why Apt Model Tabs (/why-apt/) ─────────────────────────────────────────
  const tabButtons = document.querySelectorAll<HTMLButtonElement>('.why-apt-tab-btn');
  const tabPanels = document.querySelectorAll<HTMLElement>('.why-apt-tab-panel');
  if (tabButtons.length && tabPanels.length) {
    tabButtons.forEach((btn) => {
      const targetId = btn.getAttribute('data-tab-target');
      if (!targetId) return;
      const onClick = () => {
        tabButtons.forEach((b) => {
          const active = b === btn;
          b.setAttribute('aria-selected', active ? 'true' : 'false');
          b.classList.toggle('bg-[#0070a8]', active);
          b.classList.toggle('text-white', active);
          b.classList.toggle('bg-white', !active);
          b.classList.toggle('text-[#003074]', !active);
        });
        tabPanels.forEach((p) => {
          const match = p.id === targetId;
          p.classList.toggle('hidden', !match);
        });
        ScrollTrigger.refresh();
      };
      btn.addEventListener('click', onClick);
      pageCleanups.push(() => btn.removeEventListener('click', onClick));
    });
  }
}

// ─── 4. ASTRO CLIENTROUTER HOOKS ─────────────────────────────────────────────
if (typeof window !== 'undefined') {
  document.addEventListener('astro:page-load', () => {
    initPage();
  });

  document.addEventListener('astro:before-swap', () => {
    destroyPage();
  });

  // Fallback initial load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initPage();
  } else {
    document.addEventListener('DOMContentLoaded', initPage);
  }
}

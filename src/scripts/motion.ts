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
let cursorActive = false;
let cursorInitialized = false;
let qDotX: ((val: number) => void) | null = null;
let qDotY: ((val: number) => void) | null = null;
let qRingX: ((val: number) => void) | null = null;
let qRingY: ((val: number) => void) | null = null;
let lastPointerX = -100;
let lastPointerY = -100;

export function ensureCursorActive() {
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isMotionPaused = false;
  try {
    isMotionPaused = sessionStorage.getItem('apt_motion_paused') === 'true';
  } catch (e) {}

  if (isMotionPaused || !isDesktop) {
    document.documentElement.classList.remove('has-custom-cursor');
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (dot) dot.style.opacity = '0';
    if (ring) ring.style.opacity = '0';
    return;
  }

  if (cursorActive) {
    document.documentElement.classList.add('has-custom-cursor');
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (dot) dot.style.opacity = '1';
    if (ring) ring.style.opacity = '1';

    // Rebind quickTo targets to active DOM elements
    if (dot && ring) {
      qDotX = gsap.quickTo(dot, 'x', { duration: 0.02 });
      qDotY = gsap.quickTo(dot, 'y', { duration: 0.02 });
      qRingX = gsap.quickTo(ring, 'x', { duration: 0.15, ease: 'power2.out' });
      qRingY = gsap.quickTo(ring, 'y', { duration: 0.15, ease: 'power2.out' });
      gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });
      if (lastPointerX >= 0 && lastPointerY >= 0) {
        qDotX(lastPointerX);
        qDotY(lastPointerY);
        qRingX(lastPointerX);
        qRingY(lastPointerY);
      }
    }
  }
}

function initCursor() {
  if (cursorInitialized) {
    ensureCursorActive();
    return;
  }

  let dot = document.getElementById('cursor-dot');
  let ring = document.getElementById('cursor-ring');
  let ringLabel = document.getElementById('cursor-ring-label');

  // Fallback creation if not present in static DOM
  if (!dot) {
    dot = document.createElement('div');
    dot.id = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
  }
  if (!ring) {
    ring = document.createElement('div');
    ring.id = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    ringLabel = document.createElement('span');
    ringLabel.id = 'cursor-ring-label';
    ringLabel.textContent = 'View';
    ring.appendChild(ringLabel);
    document.body.appendChild(ring);
  }

  cursorInitialized = true;

  qDotX = gsap.quickTo(dot, 'x', { duration: 0.02 });
  qDotY = gsap.quickTo(dot, 'y', { duration: 0.02 });
  qRingX = gsap.quickTo(ring, 'x', { duration: 0.15, ease: 'power2.out' });
  qRingY = gsap.quickTo(ring, 'y', { duration: 0.15, ease: 'power2.out' });

  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

  window.addEventListener('mousemove', (e) => {
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;

    if (!cursorActive) {
      cursorActive = true;
      document.documentElement.classList.add('has-custom-cursor');
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    }
    qDotX?.(e.clientX);
    qDotY?.(e.clientY);
    qRingX?.(e.clientX);
    qRingY?.(e.clientY);
  }, { passive: true });

  // Delegated states
  document.addEventListener('mouseover', (e) => {
    if (!cursorActive) return;
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
      if (ringLabel) ringLabel.style.opacity = '1';
    } else if (isLink) {
      ring.style.opacity = '1';
      dot.style.opacity = '1';
      gsap.to(ring, { width: 50, height: 50, duration: 0.2, ease: 'power2.out' });
      ring.style.backgroundColor = 'rgba(0,136,204,0.10)';
      ring.style.borderColor = '#0088cc';
      if (ringLabel) ringLabel.style.opacity = '0';
    } else {
      ring.style.opacity = '1';
      dot.style.opacity = '1';
      gsap.to(ring, { width: 36, height: 36, duration: 0.2, ease: 'power2.out' });
      ring.style.backgroundColor = 'transparent';
      ring.style.borderColor = '#0070a8';
      if (ringLabel) ringLabel.style.opacity = '0';
    }
  });

  document.addEventListener('mousedown', () => {
    if (cursorActive) gsap.to([dot, ring], { scale: 0.85, duration: 0.08 });
  });
  document.addEventListener('mouseup', () => {
    if (cursorActive) gsap.to([dot, ring], { scale: 1, duration: 0.15 });
  });
  document.addEventListener('mouseleave', () => {
    if (cursorActive) gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
  });
  document.addEventListener('mouseenter', () => {
    if (cursorActive) gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
  });
  window.addEventListener('blur', () => {
    if (cursorActive) gsap.set([dot, ring], { opacity: 0 });
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
  ensureCursorActive();

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
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
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

  // ── Pause Motion Toggle (WCAG 2.2.2 compliance) ──────────────────────────
  const pauseToggleBtn = document.getElementById('pause-motion-toggle');
  if (pauseToggleBtn) {
    const updatePauseButtonUI = (isPaused: boolean) => {
      pauseToggleBtn.textContent = isPaused ? 'Resume motion' : 'Pause motion';
      pauseToggleBtn.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
      if (isPaused) {
        document.documentElement.setAttribute('data-motion', 'paused');
        document.documentElement.classList.remove('has-custom-cursor');
        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');
        if (dot) dot.style.opacity = '0';
        if (ring) ring.style.opacity = '0';
      } else {
        document.documentElement.removeAttribute('data-motion');
        ensureCursorActive();
      }
    };

    let initialPaused = false;
    try {
      initialPaused = sessionStorage.getItem('apt_motion_paused') === 'true';
    } catch (e) {}
    updatePauseButtonUI(initialPaused);

    const onTogglePause = () => {
      let isPaused = false;
      try {
        isPaused = sessionStorage.getItem('apt_motion_paused') === 'true';
        isPaused = !isPaused;
        sessionStorage.setItem('apt_motion_paused', isPaused ? 'true' : 'false');
      } catch (e) {
        isPaused = !document.documentElement.hasAttribute('data-motion');
      }
      updatePauseButtonUI(isPaused);
      if (!isPaused) {
        ScrollTrigger.refresh();
      }
    };

    pauseToggleBtn.addEventListener('click', onTogglePause);
    pageCleanups.push(() => pauseToggleBtn.removeEventListener('click', onTogglePause));
  }

  // ── Click to Copy Handler with ARIA Live Toast ──────────────────────────
  const copyButtons = document.querySelectorAll<HTMLButtonElement>('.click-to-copy-btn');
  copyButtons.forEach((btn) => {
    const onCopy = async () => {
      const val = btn.getAttribute('data-copy-value') || btn.getAttribute('data-copy') || '';
      if (!val) return;
      try {
        await navigator.clipboard.writeText(val);
        const toast = document.getElementById('a11y-toast');
        if (toast) {
          toast.textContent = `Copied ${val} to clipboard`;
          toast.classList.remove('opacity-0');
          toast.classList.add('opacity-100');
          setTimeout(() => {
            toast.classList.remove('opacity-100');
            toast.classList.add('opacity-0');
          }, 2500);
        }
      } catch (err) {
        console.warn('Clipboard write failed:', err);
      }
    };
    btn.addEventListener('click', onCopy);
    pageCleanups.push(() => btn.removeEventListener('click', onCopy));
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
  document.addEventListener('astro:before-swap', (event: any) => {
    destroyPage();
    if (cursorActive && event?.newDocument?.documentElement) {
      event.newDocument.documentElement.classList.add('has-custom-cursor');
    }
    try {
      const isMotionPaused = sessionStorage.getItem('apt_motion_paused') === 'true';
      if (isMotionPaused && event?.newDocument?.documentElement) {
        event.newDocument.documentElement.setAttribute('data-motion', 'paused');
      }
    } catch (e) {}
  });

  document.addEventListener('astro:after-swap', () => {
    ensureCursorActive();
  });

  document.addEventListener('astro:page-load', () => {
    initPage();
    ensureCursorActive();

    // Focus lands on the new page's h1
    const h1 = document.querySelector('main h1') || document.querySelector('h1');
    if (h1) {
      h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    }

    if (cursorActive && lastPointerX >= 0 && lastPointerY >= 0) {
      qDotX?.(lastPointerX);
      qDotY?.(lastPointerY);
      qRingX?.(lastPointerX);
      qRingY?.(lastPointerY);

      const target = document.elementFromPoint(lastPointerX, lastPointerY);
      if (target) {
        target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }));
      }
    }
  });

  // Fallback initial load
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initPage();
  } else {
    document.addEventListener('DOMContentLoaded', initPage);
  }
}

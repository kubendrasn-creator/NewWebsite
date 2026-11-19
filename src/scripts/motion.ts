// src/scripts/motion.ts
// SINGLE SCROLL CLOCK: Lenis → GSAP ticker → ScrollTrigger
// All other scroll listeners removed.
// Mobile (<1024px): native scroll, no Lenis, no cursor, no pinned horizontal.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initMotion() {
  // ─── Shared state ─────────────────────────────────────────────────────────
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop      = window.innerWidth >= 1024;
  const isFinePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Always scroll to top on load, then strip any hash from URL
  history.scrollRestoration = 'manual';
  const initialHash = location.hash;
  window.scrollTo(0, 0);

  // ─── 1. LENIS — single RAF clock (desktop only) ───────────────────────────
  let lenis: Lenis | null = null;

  if (!prefersReduced && isDesktop) {
    lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
    } as any);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((t) => {
      lenis!.raf(t * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  // ─── 2. CLEAN URL NAV — hash clicks never change the URL bar ──────────────
  const headerEl = document.getElementById('site-header');

  function getHeaderHeight(): number {
    return headerEl ? headerEl.getBoundingClientRect().height : 72;
  }

  function scrollToTarget(target: Element, duration = 1.4) {
    const offset = -getHeaderHeight() - 8;
    // Move focus to section heading
    const heading = target.querySelector('h1,h2,h3') as HTMLElement | null;
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }

    if (lenis) {
      lenis.scrollTo(target as HTMLElement, {
        offset,
        duration,
        easing: (x: number) => 1 - Math.pow(1 - x, 4),
      });
    } else {
      const top = (target as HTMLElement).getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }
    // Strip hash immediately
    history.replaceState(null, '', location.pathname + location.search);
  }

  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest('a[href]') as HTMLAnchorElement | null;
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('#') || href === '#') return;
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    scrollToTarget(target);
  });

  // On load with hash — scroll to it then strip
  if (initialHash) {
    const id = initialHash.slice(1);
    const target = document.getElementById(id);
    if (target) {
      requestAnimationFrame(() => {
        scrollToTarget(target, 1.0);
      });
    } else {
      history.replaceState(null, '', location.pathname + location.search);
    }
  } else {
    history.replaceState(null, '', location.pathname + location.search);
  }

  // ─── 3. HEADER: shrink on scroll ──────────────────────────────────────────
  if (headerEl) {
    ScrollTrigger.create({
      start: 'top -60',
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

  // ─── 4. NAV ACTIVE INDICATOR ──────────────────────────────────────────────
  const navLinks    = document.querySelectorAll<HTMLAnchorElement>('.nav-anchor-link');
  const navPill     = document.getElementById('nav-sliding-pill');
  const navSections = ['services', 'pillars', 'about', 'careers', 'contact']
    .map((id) => document.getElementById(id));

  if (navLinks.length && navPill) {
    function activateNav(linkEl: HTMLAnchorElement) {
      navLinks.forEach((l) => l.removeAttribute('data-active'));
      linkEl.setAttribute('data-active', 'true');
      const rect = linkEl.getBoundingClientRect();
      const parentRect = linkEl.parentElement?.getBoundingClientRect();
      if (parentRect) {
        gsap.to(navPill, {
          left: rect.left - parentRect.left,
          width: rect.width,
          duration: 0.25,
          ease: 'power2.out',
        });
      }
    }

    navSections.forEach((sec, idx) => {
      if (!sec || !navLinks[idx]) return;
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter:     () => activateNav(navLinks[idx]),
        onEnterBack: () => activateNav(navLinks[idx]),
      });
    });
  }

  // ─── 5. HERO HEADLINE: per-word reveal ────────────────────────────────────
  const heroHeadline = document.querySelector('.hero-kinetic-headline');
  if (heroHeadline && !prefersReduced) {
    const words = heroHeadline.querySelectorAll<HTMLElement>('.word-inner');
    if (words.length) {
      gsap.set(words, { yPercent: 110, opacity: 0 });
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 1.0,
        stagger: 0.09,
        ease: 'power3.out',
        delay: 0.15,
      });
    }
  }

  // ─── 6. PILLARS: pinned scroll story ──────────────────────────────────────
  if (isDesktop && !prefersReduced) {
    const pillarsSection = document.getElementById('pillars');
    if (pillarsSection) {
      const scenes    = pillarsSection.querySelectorAll<HTMLElement>('.pillar-scene');
      const railFill  = document.getElementById('pillars-rail-indicator');
      const wordLabel = document.getElementById('pillar-word-label');
      const words     = ['Apt', 'Agile', 'Assured'];

      if (scenes.length) {
        // Set initial states
        scenes.forEach((s, i) => {
          if (i > 0) gsap.set(s, { opacity: 0 });
        });

        ScrollTrigger.create({
          trigger: pillarsSection,
          start: 'top top+=72',
          end: `+=${scenes.length * 600}`,
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const idx = Math.min(scenes.length - 1, Math.floor(self.progress * scenes.length));
            scenes.forEach((s, i) => {
              gsap.to(s, {
                opacity: i === idx ? 1 : 0,
                duration: 0.4,
                ease: 'power2.inOut',
                overwrite: true,
              });
            });
            if (railFill) {
              gsap.set(railFill, { scaleY: self.progress });
            }
            if (wordLabel) {
              wordLabel.textContent = words[idx] || words[0];
            }
          },
        });
      }
    }
  }

  // ─── 7. SERVICES: stacked card deck (desktop only) ────────────────────────
  if (isDesktop && !prefersReduced) {
    const deck = document.getElementById('services-deck');
    if (deck) {
      const cards = deck.querySelectorAll<HTMLElement>('.service-card-stack');
      const totalCards = cards.length;

      cards.forEach((card, i) => {
        // Each card pins and when the NEXT card comes, it scales down
        ScrollTrigger.create({
          trigger: card,
          start: 'top top+=72',
          end: `+=${totalCards * 80}`,
          pin: i < totalCards - 1,
          pinSpacing: false,
          scrub: 0.6,
          onUpdate: (self) => {
            if (i < totalCards - 1) {
              const scale = gsap.utils.mapRange(0.6, 1, 1, 0.94, self.progress);
              const opacity = gsap.utils.mapRange(0.6, 1, 1, 0.75, self.progress);
              gsap.set(card, { scale, opacity, transformOrigin: 'center top' });
            }
          },
        });
      });
    }
  }

  // ─── 8. DELIVERY ROUTE SVG: draw on scroll ────────────────────────────────
  const routePath = document.getElementById('delivery-route-svg-path') as SVGPathElement | null;
  const pulseDot  = document.getElementById('delivery-pulse-dot');

  if (routePath && !prefersReduced) {
    const pathLength = routePath.getTotalLength();
    gsap.set(routePath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

    ScrollTrigger.create({
      trigger: '#delivery',
      start: 'top 70%',
      end: 'bottom 40%',
      scrub: 0.8,
      onUpdate: (self) => {
        gsap.set(routePath, { strokeDashoffset: pathLength * (1 - self.progress) });
        if (pulseDot) {
          const pt = routePath.getPointAtLength(pathLength * self.progress);
          gsap.set(pulseDot, { attr: { cx: pt.x, cy: pt.y } });
        }
      },
    });
  }

  // ─── 9. WHY APT: horizontal scroll (desktop only) ─────────────────────────
  if (isDesktop && !prefersReduced) {
    const whySection  = document.getElementById('why-apt');
    const hTrack      = document.getElementById('why-apt-horizontal-track');
    if (whySection && hTrack) {
      const totalScroll = hTrack.scrollWidth - window.innerWidth + 120;
      gsap.to(hTrack, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: whySection,
          start: 'top top+=72',
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    }
  }

  // ─── 10. ABOUT: scroll-linked text fill ───────────────────────────────────
  const aboutWords = document.querySelectorAll<HTMLElement>('.about-reveal-word');
  if (aboutWords.length && !prefersReduced) {
    const narrative = document.getElementById('about-narrative');
    if (narrative) {
      gsap.fromTo(
        aboutWords,
        { color: '#0070a8' },
        {
          color: '#003074',
          stagger: 0.03,
          ease: 'none',
          scrollTrigger: {
            trigger: narrative,
            start: 'top 80%',
            end: 'bottom 55%',
            scrub: 0.6,
          },
        }
      );
    }
  }

  // ─── 11. GENERIC FADE-UP REVEALS ──────────────────────────────────────────
  if (!prefersReduced) {
    ScrollTrigger.batch('.reveal-up', {
      onEnter: (els) => {
        gsap.fromTo(els, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0,
          duration: 0.75,
          ease: 'power2.out',
          stagger: 0.08,
        });
      },
      once: true,
      start: 'top 88%',
    });
  }

  // ─── 12. MAGNETIC BUTTONS ─────────────────────────────────────────────────
  if (isFinePointer && !prefersReduced) {
    document.querySelectorAll<HTMLElement>('.magnetic-btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.28;
        const y = (e.clientY - r.top  - r.height / 2) * 0.28;
        gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out', overwrite: true });
      }, { passive: true });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)', overwrite: true });
      });
    });
  }

  // ─── 13. CUSTOM CURSOR (hover+fine pointer only, not reduced-motion) ───────
  if (isFinePointer && !prefersReduced) {
    initCursor();
  }

  // ─── 14. SCROLL TRIGGER REFRESH ───────────────────────────────────────────
  // After fonts + images load, recalculate all trigger positions
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  // ─── Cleanup ──────────────────────────────────────────────────────────────
  return () => {
    lenis?.destroy();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}

// ─── Custom Cursor ───────────────────────────────────────────────────────────
function initCursor() {
  // Create elements
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.id  = 'cursor-dot';
  ring.id = 'cursor-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');

  Object.assign(dot.style, {
    position: 'fixed', top: '0', left: '0',
    width: '6px', height: '6px', borderRadius: '50%',
    background: '#0070a8',
    pointerEvents: 'none', zIndex: '10001',
    transform: 'translate3d(-100px,-100px,0)',
    willChange: 'transform',
  });

  const ringLabel = document.createElement('span');
  ringLabel.id = 'cursor-ring-label';
  Object.assign(ringLabel.style, {
    position: 'absolute', inset: '0',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '10px', fontWeight: '800', color: '#0070a8',
    opacity: '0', transition: 'opacity 0.2s',
    letterSpacing: '0.08em', userSelect: 'none',
  });
  ringLabel.textContent = 'View';

  Object.assign(ring.style, {
    position: 'fixed', top: '0', left: '0',
    width: '36px', height: '36px', borderRadius: '50%',
    border: '1.5px solid #0070a8',
    pointerEvents: 'none', zIndex: '10000',
    transform: 'translate3d(-100px,-100px,0)',
    willChange: 'transform',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'width 0.3s cubic-bezier(.16,1,.3,1), height 0.3s cubic-bezier(.16,1,.3,1), background-color 0.2s, opacity 0.3s',
  });
  ring.appendChild(ringLabel);

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  // Hide native cursor via class
  document.documentElement.classList.add('has-custom-cursor');

  let initialized = false;

  const qDotX  = gsap.quickTo(dot,  'x', { duration: 0.05 });
  const qDotY  = gsap.quickTo(dot,  'y', { duration: 0.05 });
  const qRingX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
  const qRingY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

  // Position via transform so they don't affect layout
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

  window.addEventListener('mousemove', (e) => {
    if (!initialized) {
      initialized = true;
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    }
    qDotX(e.clientX);
    qDotY(e.clientY);
    qRingX(e.clientX);
    qRingY(e.clientY);
  }, { passive: true });

  // States via event delegation
  document.addEventListener('mouseover', (e) => {
    const target = e.target as Element;
    const viewCard = target.closest('[data-cursor="view"]');
    const isLink   = target.closest('a, button, [role="button"]');
    const isInput  = target.closest('input, textarea, select');

    if (viewCard) {
      gsap.to(ring, { width: 84, height: 84, duration: 0.3, ease: 'power2.out' });
      ring.style.backgroundColor = 'rgba(0,112,168,0.08)';
      ringLabel.style.opacity = '1';
    } else if (isLink) {
      gsap.to(ring, { width: 56, height: 56, duration: 0.25, ease: 'power2.out' });
      ring.style.backgroundColor = 'rgba(0,136,204,0.10)';
      ringLabel.style.opacity = '0';
    } else if (isInput) {
      ring.style.borderColor = 'transparent';
    } else {
      gsap.to(ring, { width: 36, height: 36, duration: 0.3, ease: 'power2.out' });
      ring.style.backgroundColor = 'transparent';
      ring.style.borderColor = '#0070a8';
      ringLabel.style.opacity = '0';
    }
  });

  document.addEventListener('mousedown', () => {
    gsap.to([dot, ring], { scale: 0.85, duration: 0.1 });
  });
  document.addEventListener('mouseup', () => {
    gsap.to([dot, ring], { scale: 1, duration: 0.2, ease: 'elastic.out(1,0.5)' });
  });

  document.addEventListener('mouseleave', () => {
    gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
  });
  document.addEventListener('mouseenter', () => {
    gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
  });

  window.addEventListener('blur', () => {
    gsap.set([dot, ring], { opacity: 0 });
  });
}

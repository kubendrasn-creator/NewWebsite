// src/scripts/motion.ts
// GSAP + ScrollTrigger + Lenis motion orchestration
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initMotion() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.innerWidth >= 1024;

  // On mobile (<1024px), skip CPU-heavy animations per rules (1)-(4)
  if (!isDesktop) {
    return () => {};
  }

  // 1. Lenis Smooth Scroll (single RAF loop with GSAP) - Desktop only (>= 1024px)
  let lenis: Lenis | null = null;
  if (!prefersReduced && isDesktop) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  // 2. Custom Cursor Follower (pointer: fine only)
  const cursorFollower = document.getElementById('custom-cursor');
  if (cursorFollower && window.matchMedia('(pointer: fine)').matches && !prefersReduced) {
    window.addEventListener('mousemove', (e) => {
      gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out',
      });
    }, { passive: true });

    // Interactive element expansion
    const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorFollower.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursorFollower.classList.remove('is-hovering'));
    });
  }

  // 3. Magnetic Buttons
  if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    const magneticBtns = document.querySelectorAll<HTMLElement>('.magnetic-btn');
    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
        gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  // 4. Hero Headline Per-Word Masked Reveal
  const heroHeadline = document.querySelector('.hero-kinetic-headline');
  if (heroHeadline && !prefersReduced) {
    const words = heroHeadline.querySelectorAll('.word-inner');
    gsap.fromTo(
      words,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.1,
      }
    );
  }

  // 5. Pinned Pillars Scroll Story (Apt / Agile / Assured)
  const pillarsSection = document.getElementById('pillars');
  if (pillarsSection && !prefersReduced && window.innerWidth >= 1024) {
    const steps = pillarsSection.querySelectorAll<HTMLElement>('.pillar-step-card');
    const images = pillarsSection.querySelectorAll<HTMLElement>('.pillar-photo');
    const railIndicator = document.getElementById('pillars-rail-indicator');

    if (steps.length > 0) {
      ScrollTrigger.create({
        trigger: pillarsSection,
        start: 'top top+=80',
        end: `+=${steps.length * 500}`,
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const stepIndex = Math.min(
            steps.length - 1,
            Math.floor(self.progress * steps.length)
          );

          steps.forEach((step, idx) => {
            if (idx === stepIndex) {
              step.classList.remove('opacity-25', 'grayscale');
              step.classList.add('opacity-100');
            } else {
              step.classList.add('opacity-25', 'grayscale');
              step.classList.remove('opacity-100');
            }
          });

          images.forEach((img, idx) => {
            if (idx === stepIndex) {
              img.classList.remove('opacity-0', 'scale-95');
              img.classList.add('opacity-100', 'scale-100');
            } else {
              img.classList.add('opacity-0', 'scale-95');
              img.classList.remove('opacity-100', 'scale-100');
            }
          });

          if (railIndicator) {
            gsap.to(railIndicator, { scaleY: self.progress, duration: 0.1 });
          }
        },
      });
    }
  }

  // 6. SVG Delivery Route Drawing on Scroll
  const routePath = document.getElementById('delivery-route-svg-path') as SVGPathElement | null;
  const pulseDot = document.getElementById('delivery-pulse-dot');
  if (routePath && !prefersReduced) {
    const pathLength = routePath.getTotalLength();
    gsap.set(routePath, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    ScrollTrigger.create({
      trigger: '#delivery',
      start: 'top 75%',
      end: 'bottom 45%',
      scrub: 0.8,
      onUpdate: (self) => {
        const offset = pathLength * (1 - self.progress);
        gsap.set(routePath, { strokeDashoffset: offset });

        if (pulseDot) {
          const point = routePath.getPointAtLength(pathLength * self.progress);
          gsap.set(pulseDot, { attr: { cx: point.x, cy: point.y } });
        }
      },
    });
  }

  // 7. Why Apt: Horizontal Scroll on Desktop
  const whyAptSection = document.getElementById('why-apt');
  const horizontalTrack = document.getElementById('why-apt-horizontal-track');
  if (whyAptSection && horizontalTrack && !prefersReduced && window.innerWidth >= 1024) {
    const totalScroll = horizontalTrack.scrollWidth - window.innerWidth + 120;
    gsap.to(horizontalTrack, {
      x: () => -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: whyAptSection,
        start: 'top top+=80',
        end: () => `+=${totalScroll}`,
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });
  }

  // 8. About Section: Scroll-Linked Text Fill Reveal
  const aboutWords = document.querySelectorAll('.about-reveal-word');
  if (aboutWords.length > 0 && !prefersReduced) {
    gsap.fromTo(
      aboutWords,
      { color: '#0070a8' },
      {
        color: '#003074',
        stagger: 0.04,
        ease: 'none',
        scrollTrigger: {
          trigger: '#about-narrative',
          start: 'top 80%',
          end: 'bottom 50%',
          scrub: 0.6,
        },
      }
    );
  }

  // 9. Sticky Header Shrink on Scroll
  const header = document.getElementById('site-header');
  if (header) {
    ScrollTrigger.create({
      start: 'top -50',
      onUpdate: (self) => {
        if (self.progress > 0) {
          header.classList.add('py-3', 'shadow-md', 'bg-white/95');
          header.classList.remove('py-5', 'bg-white/80');
        } else {
          header.classList.add('py-5', 'bg-white/80');
          header.classList.remove('py-3', 'shadow-md', 'bg-white/95');
        }
      },
    });
  }

  // 10. Nav Active Section Sliding Indicator
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-anchor-link');
  const navIndicator = document.getElementById('nav-sliding-pill');
  if (navLinks.length > 0 && navIndicator) {
    const sections = ['services', 'why-apt', 'about', 'careers', 'contact'].map((id) =>
      document.getElementById(id)
    );

    sections.forEach((sec, idx) => {
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 45%',
        end: 'bottom 45%',
        onEnter: () => activateNav(idx),
        onEnterBack: () => activateNav(idx),
      });
    });

    function activateNav(index: number) {
      const activeLink = navLinks[index];
      if (!activeLink) return;
      const rect = activeLink.getBoundingClientRect();
      const parentRect = activeLink.parentElement?.getBoundingClientRect() || rect;
      gsap.to(navIndicator, {
        left: rect.left - parentRect.left,
        width: rect.width,
        duration: 0.25,
        ease: 'power2.out',
      });
    }
  }

  return () => {
    lenis?.destroy();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}

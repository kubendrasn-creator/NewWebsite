// src/scripts/mobile-nav.ts
// Lightweight mobile navigation script (0 KB external libraries).
// Handles hash-less smooth scrolling, focus management, and URL cleanliness on mobile.

export function initMobileNav() {
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  const headerEl = document.getElementById('site-header');

  function getHeaderHeight(): number {
    return headerEl ? headerEl.getBoundingClientRect().height : 64;
  }

  function scrollToSection(target: HTMLElement) {
    const offset = -getHeaderHeight() - 8;
    const heading = target.querySelector('h1,h2,h3') as HTMLElement | null;
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }

    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });

    // Clean URL: strip hash
    history.replaceState(null, '', location.pathname + location.search);
  }

  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest('a[href]') as HTMLAnchorElement | null;
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('#') || href === '#') return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    e.preventDefault();
    scrollToSection(target);
  });

  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) {
      setTimeout(() => scrollToSection(target), 100);
    } else {
      history.replaceState(null, '', location.pathname + location.search);
    }
  } else {
    history.replaceState(null, '', location.pathname + location.search);
  }
}

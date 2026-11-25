# Apt Infosoft – Multi-Page Static Website

> Production-grade multi-page static website for **Apt Infosoft**, built with Astro 7, TypeScript, Tailwind CSS 4, Preact islands, and a pure mathematical SVG motion engine. Deployed on GitHub Pages with Astro ClientRouter page transitions.

**Live Site**: [https://kubendrasn-creator.github.io/NewWebsite/](https://kubendrasn-creator.github.io/NewWebsite/)

---

## 1. Architecture & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Astro 7.x (Static SSG, zero-JS-by-default) |
| **Styling** | Tailwind CSS 4 with `@tailwindcss/typography` |
| **Interactive Islands** | Preact 11 (`client:visible` / `client:idle`) |
| **Motion Engine** | Pure deterministic SVG motion engine (`src/motion/`) + GSAP 3 / ScrollTrigger (native scroll, zero pin-locking) |
| **Page Transitions** | Astro `<ClientRouter />` with ~8° slanted polygon wipe |
| **Deployment** | GitHub Pages via GitHub Actions CI/CD |
| **Base Path** | `/NewWebsite/` (project site) |

---

## 2. Routes (13 Public Static Pages)

| Route | Description |
| :--- | :--- |
| `/` | Home: Hero (Scene A 8s pure SVG loop), marquee, Apt/Agile/Assured bento pillars, 5-beat Motion Scroll Story with kinetic captions, CTA |
| `/services/` | All six practice areas as a stacked card deck with bespoke SVG illustrations |
| `/services/[slug]/` | Six individual service pages via `getStaticPaths` (`product-engineering`, `application-development`, `saas`, `application-modernization`, `testing`, `business-analytics`) |
| `/why-apt/` | Flexibility (with Time & Material / Fixed Price tabs), Reliability, Efficiency — three full-viewport scenes |
| `/about/` | Company narrative with scroll-linked text fill, expandable "Who can benefit?" accordion cards |
| `/careers/` | Two role cards with direct "Express Interest" email action buttons |
| `/contact/` | Contact form (Web3Forms + `mailto:` fallback), phone/email details, India address, delivery route |
| `/404` | On-brand error page with navigation recovery links |

> **Internal Dev Route**: `/motion-lab/` is an internal motion inspection tool (`noindex`, excluded from navigation and `@astrojs/sitemap`).

All navigation uses clean route URLs — no hash anchors. A base-aware `url()` helper prefixes every link and asset with `import.meta.env.BASE_URL`.

---

## 3. Design System & Logo Color Tokens

All tokens are sampled from the Apt Infosoft logo (`public/logo.png`). No extraneous hues.

| Token | Hex | Usage | WCAG AA |
| :--- | :--- | :--- | :--- |
| `brand-blue` | `#0088cc` | Graphics, accents, large decorative headings | ✓ 3.0:1 (large text) |
| `brand-navy` | `#003074` | Body text, headings, wordmark | ✓ 12.5:1 (AAA) |
| `brand-ink` | `#0070a8` | Button fills, links, badges, icons | ✓ 5.4:1 (AA) |
| `brand-ice` | `#eef7fd` | Section backgrounds, card tints | Background tint |
| `light-tint` | `#d6effb` | Derived tint (`color-mix` of `#0088cc` 16% with `#ffffff`) for SVG motion primitives | SVG fill |
| `white` | `#ffffff` | Page canvas, reverse text | Base |

**Light mode only** — `color-scheme: light` enforced globally. No dark mode code.

---

## 4. Key Features

### Pure Motion Engine & Choreography (`src/motion/`)
- **Scene A (Hero Loop, 8.0s):** Slanted rounded blocks assemble into the traced swoosh "i" mark, hold cleanly, and ease back apart (`renderSceneA(t)`).
- **Scene B (5-Beat Scroll Story):** Scroll-progress driven pure SVG beats (`Apt`, `Product Engineering`, `Application Modernization`, `Delivery`, `Testing`) via `renderBeat(idx, p)` with CSS-only per-word masked kinetic captions on solid white.
- **Strict Rules:** Pure mathematical functions of $t$ (`expoOut`, `quartInOut`, `spring`, `anticipation`), 8px grid snapping (`snap()`), exact $8^\circ$ forward slant (`slantRect()`), and full `prefers-reduced-motion` + `Pause motion` toggle support.
- **Storyboard & Review Assets:** See [docs/storyboard.md](docs/storyboard.md), 12-frame contact sheets in `docs/contact-sheets/`, and the 24s 1080p brand film at `docs/media/apt-infosoft-brand-film.mp4`.

### Page Transitions
- Astro `<ClientRouter />` with `transition:persist` on Header and custom cursor elements.
- Signature ~8° slanted polygon wipe (`clip-path` animation).
- Direction-aware: forward vs back determined from navigation order.

### Mobile Navigation Drawer & Dynamic Active Route
- Accessible hamburger toggle with animated open ↔ close SVG icons, auto-closing on link tap, `Escape` key, or page transition.
- Desktop nav pill and mobile drawer links dynamically highlight the current route on every `astro:page-load` event.

### Custom Cursor
- Dot + ring follower enabled only when `(hover: hover)` and `(pointer: fine)` and not `prefers-reduced-motion`.
- Persists seamlessly across all ClientRouter page transitions via `transition:persist`.

### Interactive Islands (Preact)
- **ContactForm** (`client:visible`): Floating labels, honeypot, Web3Forms integration with `mailto:` fallback.
- **AudienceSelector**: Independently expandable accordion cards (`grid-template-rows` transition).

### Bespoke SVG Illustrations
- 10 hand-crafted SVG illustrations (6 service icons, 3 pillar scenes, 1 hero swoosh) — no placeholder or stock images.

### SEO & Structured Data
- Every page has canonical URL, Open Graph, and Twitter Card meta tags.
- Branded 1200×630 PNG OG preview image in `public/og-image.png`.
- JSON-LD schemas: `Organization` (global), `BreadcrumbList` (all routes).
- Auto-generated `sitemap-index.xml` via `@astrojs/sitemap` (excluding `/motion-lab/`).

---

## 5. Development & Local Setup

> **Note:** `astro` is installed locally in `node_modules` (not globally in PATH). Run it through `pnpm` (e.g. `pnpm run dev` or `pnpm exec astro dev --background`).

```bash
# Install dependencies
pnpm install

# Run local development server (foreground)
pnpm run dev

# Or run Astro dev server in background mode
pnpm exec astro dev --background
pnpm exec astro dev status
pnpm exec astro dev logs
pnpm exec astro dev stop

# Build production static bundle
pnpm run build

# Preview build locally
pnpm run preview

# TypeScript & Astro typecheck
node scripts/cli.js check
```

### Verification & Audit Scripts

```bash
# Pure motion engine unit tests (58 assertions)
node tests/motion.test.mjs

# WCAG 2.1 contrast, link integrity, and CONTENT.md copy audits
node scripts/check-contrast.mjs
node scripts/check-links.mjs
node scripts/copy-audit.mjs

# Playwright end-to-end verification suite
pnpm exec playwright test
```

### Environment Variables

Create a `.env` file in the project root:
```env
# Optional: Web3Forms access key for contact form submissions
PUBLIC_WEB3FORMS_KEY=your_access_key_here

# Optional: Explicitly enable /motion-lab/ in production builds
PUBLIC_ENABLE_MOTION_LAB=false
```
If `PUBLIC_WEB3FORMS_KEY` is not set, the contact form gracefully opens a pre-filled `mailto:info@aptinfosoft.com`.

---

## 6. Deployment to GitHub Pages

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`):

1. **Configure GitHub Pages Source**:
   - Go to your repository on GitHub: **Settings -> Pages**.
   - Under **Build and deployment -> Source**, select **GitHub Actions**.

2. **Configure Contact Form Secret (Optional)**:
   - Go to **Settings -> Secrets and variables -> Actions**.
   - Add a repository secret named `PUBLIC_WEB3FORMS_KEY` with your Web3Forms access key.

3. **Deploy**:
   - Push to `main` (or trigger manually via **Actions -> Deploy to GitHub Pages -> Run workflow**).
   - The workflow installs dependencies with `pnpm install --frozen-lockfile`, runs `pnpm run build`, and deploys `dist/` via `actions/deploy-pages@v4`.

### Switching to a Custom Domain (e.g. `aptinfosoft.com`)

When pointing the production site to a custom domain:
1. In `astro.config.mjs`:
   ```js
   site: 'https://aptinfosoft.com',
   base: '/',
   ```
2. Create `public/CNAME`:
   ```
   aptinfosoft.com
   ```
3. In GitHub: **Settings -> Pages -> Custom domain** -> enter `aptinfosoft.com` and enforce HTTPS.
4. *Legacy URL Redirects*: All 15 legacy redirects (`/about-us.html`, `/product-engineering-services.html`, `/contact-us.php`, etc.) defined in `astro.config.mjs` automatically become active at root.

For full operational maintenance and development guidance, refer to [HANDOVER.md](file:///c:/Users/aptso/Desktop/NEW%20APT%20Website/HANDOVER.md).

---

## 7. Project Structure

```
src/
├── content/site.ts               # Single source of truth for all site content (from CONTENT.md)
├── motion/
│   ├── ease.ts                   # expoOut, quartInOut, spring, anticipation
│   ├── primitives.ts             # snap(), slantRect(), morphPoints(), color tokens
│   └── scene-engine.ts           # Pure deterministic Scene A, Scene B, and brand film engine
├── layouts/Base.astro            # Root layout with ClientRouter, meta tags, structured data
├── components/
│   ├── Header.astro              # Sticky header with transition:persist, mobile drawer, active route sync
│   ├── Footer.astro              # Brand footer with giant wordmark motif
│   ├── Hero.astro                # Hero with Scene A 8s pure SVG loop
│   ├── MotionScrollStory.astro   # 5-beat Scene B scroll story with kinetic captions
│   ├── PillarsScrollStory.astro  # Apt, Agile, Assured bento grid
│   ├── CTABand.astro             # Gradient CTA section
│   ├── DeliverySection.astro     # SVG delivery route arc (used on Contact page)
│   ├── illustrations/            # 10 bespoke SVG illustration components
│   └── islands/                  # Preact interactive islands (ContactForm)
├── pages/
│   ├── index.astro               # Home
│   ├── 404.astro                 # Custom 404
│   ├── motion-lab/index.astro    # Internal motion inspection tool (noindex)
│   ├── services/index.astro      # Services overview
│   ├── services/[slug].astro     # Individual service template (6 pages)
│   ├── why-apt/index.astro       # Why Apt (3 scenes)
│   ├── about/index.astro         # About with accordion
│   ├── careers/index.astro       # Careers with apply actions
│   └── contact/index.astro       # Contact form + details
├── scripts/motion.ts             # Unified GSAP lifecycle engine with cursor persistence
├── styles/global.css             # Design system tokens, animations, page transition keyframes
└── utils/url.ts                  # Base-aware url() and asset() helpers
```

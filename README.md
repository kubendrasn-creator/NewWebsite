# Apt Infosoft – Multi-Page Static Website

> Production-grade multi-page static website for **Apt Infosoft**, built with Astro 7, TypeScript, Tailwind CSS 4, and Preact islands. Deployed on GitHub Pages with Astro ClientRouter page transitions.

**Live Site**: [https://kubendrasn-creator.github.io/NewWebsite/](https://kubendrasn-creator.github.io/NewWebsite/)

---

## 1. Architecture & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Astro 7.x (Static SSG, zero-JS-by-default) |
| **Styling** | Tailwind CSS 4 with `@tailwindcss/typography` |
| **Interactive Islands** | Preact 11 (`client:visible` / `client:idle`) |
| **Animations** | GSAP 3 + ScrollTrigger (native scroll, no virtual scroll) |
| **WebGL** | OGL Aurora mesh shader (lazy-loaded, desktop only) |
| **Page Transitions** | Astro `<ClientRouter />` with ~8° slanted polygon wipe |
| **Deployment** | GitHub Pages via GitHub Actions CI/CD |
| **Base Path** | `/NewWebsite/` (project site) |

---

## 2. Routes (13 Static Pages)

| Route | Description |
| :--- | :--- |
| `/` | Home: Hero (WebGL shader + swoosh), marquee, Apt/Agile/Assured pillars, services teaser, delivery arc, CTA |
| `/services/` | All six practice areas as a stacked card deck with bespoke SVG illustrations |
| `/services/[slug]/` | Six individual service pages via `getStaticPaths` (product-engineering, application-development, saas, application-modernization, testing, business-analytics) |
| `/why-apt/` | Flexibility (with Time & Material / Fixed Price tabs), Reliability, Efficiency — three full-viewport scenes |
| `/about/` | Company narrative with scroll-linked text fill, expandable "Who can benefit?" accordion cards |
| `/careers/` | Two role cards with direct "Express Interest" email action buttons |
| `/contact/` | Contact form (Web3Forms + mailto fallback), phone/email details, India address, delivery route |
| `/404` | On-brand error page with navigation recovery links |

All navigation uses clean route URLs — no hash anchors. A base-aware `url()` helper prefixes every link and asset with `import.meta.env.BASE_URL`.

---

## 3. Design System & Logo Color Tokens

All tokens sampled from the Apt Infosoft logo (`public/logo.png`). No extraneous hues.

| Token | Hex | Usage | WCAG AA |
| :--- | :--- | :--- | :--- |
| `brand-blue` | `#0088cc` | Graphics, gradients, large headings | ✓ 3.0:1 (large text) |
| `brand-navy` | `#003074` | Body text, headings, wordmark | ✓ 12.5:1 (AAA) |
| `brand-ink` | `#0070a8` | Button fills, links, badges, icons | ✓ 4.7:1 (AA) |
| `brand-ice` | `#eef7fd` | Section backgrounds, card tints | Background tint |
| `white` | `#ffffff` | Page canvas, reverse text | Base |

**Light mode only** — `color-scheme: light` enforced globally. No dark mode code.

---

## 4. Key Features

### Page Transitions
- Astro `<ClientRouter />` with `transition:persist` on Header and custom cursor elements.
- Signature ~8° slanted polygon wipe (`clip-path` animation, ~650ms expo-out).
- Direction-aware: forward vs back determined from navigation order.

### Mobile Navigation Drawer
- Accessible hamburger toggle with animated open ↔ close SVG icons.
- Slide-down drawer with all route links and a primary CTA.
- Auto-closes on link tap, `Escape` key, or page transition.

### Custom Cursor
- Dot + ring follower enabled only when `(hover: hover)` and `(pointer: fine)` and not `prefers-reduced-motion`.
- Persists seamlessly across all ClientRouter page transitions via `transition:persist`.
- Native cursor hidden via CSS when custom cursor is active; restored for touch/keyboard/no-JS.

### Dynamic Active Route Indicator
- Desktop nav pill and mobile drawer links dynamically highlight the current route on every `astro:page-load` event.
- Computed from `window.location.pathname` — no stale server-rendered state.

### Interactive Islands (Preact)
- **ContactForm** (`client:visible`): Floating labels, honeypot, Web3Forms integration with `mailto:` fallback.
- **EngagementTabs** (`client:visible`): Time & Material vs Fixed Price morphing tabs.
- **AudienceSelector**: Independently expandable accordion cards (grid-template-rows transition).

### Motion & Shader Stack
- WebGL OGL aurora mesh shader in logo colors (lazy-loaded via `requestIdleCallback`, DPR capped at 1.5, paused offscreen).
- CSS animated mesh gradient fallback for `prefers-reduced-motion`, `saveData`, low CPU, no WebGL, or `< 768px` viewports.
- GSAP ScrollTrigger batch reveals (`once: true`), scroll-linked text fill, delivery route SVG draw with travelling pulse.
- Per-word kinetic headline reveal using vanilla span wrapping + GSAP stagger (no SplitText license needed).

### Bespoke SVG Illustrations
- 10 hand-crafted SVG illustrations (6 service icons, 3 pillar scenes, 1 hero swoosh) — no placeholder or stock images.
- All use brand colors exclusively. CSS-animated line draws, morphs, and pulses.

### SEO & Structured Data
- Every page has canonical URL, Open Graph, and Twitter Card meta tags.
- Branded 1200×630 OG preview image in `public/og-image.svg`.
- JSON-LD schemas: `Organization` (global), `BreadcrumbList` (all routes).
- Auto-generated `sitemap-index.xml` via `@astrojs/sitemap`.

---

## 5. Shape Language & Typography

- **Slant Angle**: Consistent ~8° forward slant matching the logo's italic angle (page transitions, marquee separators, decorative bands).
- **Swoosh Motif**: Traced from the logo's dynamic `i` flick, reused across the hero background, delivery route arc, and card accent glows.
- **Typography**: **Plus Jakarta Sans** (fallback: Inter → system-ui). Chosen for its geometric structure and humanist italic terminals that echo the logo.
- **Corner Radii**: Standardized 8–14px moderate rounded corners.

---

## 6. Development & Local Setup

```bash
# Install dependencies
pnpm install

# Run local development server
pnpm run dev

# Build production static bundle
pnpm run build

# Preview build locally
pnpm run preview

# TypeScript & Astro typecheck
node scripts/cli.js check
```

### Environment Variables

Create a `.env` file in the project root:
```env
# Optional: Web3Forms access key for contact form submissions
PUBLIC_WEB3FORMS_KEY=your_access_key_here
```
If `PUBLIC_WEB3FORMS_KEY` is not set, the contact form gracefully opens a pre-filled `mailto:info@aptinfosoft.com`.

---

## 7. Deployment to GitHub Pages

Deployment is automated via GitHub Actions (`.github/workflows/deploy.yml`):

1. **Configure GitHub Pages Source**:
   - Go to your repository on GitHub: **Settings -> Pages**.
   - Under **Build and deployment -> Source**, select **GitHub Actions**.

2. **Configure Contact Form Secret (Optional)**:
   - Go to **Settings -> Secrets and variables -> Actions**.
   - Add a repository secret named `PUBLIC_WEB3FORMS_KEY` with your Web3Forms access key.
   - If omitted, the contact form automatically falls back to standard pre-filled `mailto:info@aptinfosoft.com`.

3. **Deploy**:
   - Push to `master` (or `main`) or trigger manually via **Actions -> Deploy to GitHub Pages -> Run workflow**.
   - The workflow executes the `quality` gate (contrast ratio check, link integrity, copy audit) before deploying to GitHub Pages.

### Switching to a Custom Domain (e.g. `aptinfosoft.com`)

When pointing the production site to the custom domain:
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
4. *Legacy URL Redirects*: All 15 legacy redirects (`/about-us.html`, `/product-engineering-services.html`, `/contact-us.php`, etc.) defined in `astro.config.mjs` automatically become active at root!

For full operational maintenance and development guidance, refer to [HANDOVER.md](file:///c:/Users/aptso/Desktop/NEW%20APT%20Website/HANDOVER.md).

---

## 8. GSAP License Notice

- **ScrollTrigger & Core GSAP**: Standard GreenSock Public License.
- **SplitText**: Not used. The per-word/per-character masked reveal is built with vanilla semantic DOM span wrapping + GSAP `fromTo` staggering — zero external licensing dependencies.

---

## 9. Project Structure

```
src/
├── content/site.ts          # Single source of truth for all site content (from CONTENT.md)
├── layouts/Base.astro       # Root layout with ClientRouter, meta tags, structured data
├── components/
│   ├── Header.astro         # Sticky header with transition:persist, mobile drawer, active route sync
│   ├── Footer.astro         # Brand footer with giant wordmark motif
│   ├── Hero.astro           # WebGL + CSS fallback hero with kinetic headline
│   ├── CTABand.astro        # Gradient CTA section
│   ├── DeliverySection.astro # SVG delivery route arc with pulse animation
│   ├── illustrations/       # 10 bespoke SVG illustration components
│   └── islands/             # Preact interactive islands (ContactForm, EngagementTabs, etc.)
├── pages/
│   ├── index.astro          # Home
│   ├── 404.astro            # Custom 404
│   ├── services/index.astro # Services overview
│   ├── services/[slug].astro # Individual service template (6 pages)
│   ├── why-apt/index.astro  # Why Apt (3 scenes)
│   ├── about/index.astro    # About with accordion
│   ├── careers/index.astro  # Careers with apply actions
│   └── contact/index.astro  # Contact form + details
├── scripts/motion.ts        # Unified GSAP lifecycle engine with cursor persistence
├── styles/global.css        # Design system tokens, animations, page transition keyframes
└── utils/url.ts             # Base-aware url() and asset() helpers
```

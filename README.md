# Apt Infosoft – Production-Grade Static Website

> Award-level static marketing website for **Apt Infosoft**, built with Astro, TypeScript, Tailwind CSS, and Preact islands.

---

## 1. Project Overview & Architecture

- **Framework**: Astro 7.x (Static SSG, zero runtime backend)
- **Deployment**: GitHub Pages (`https://kubendrasn-creator.github.io/NewWebsite/`)
- **Interactive Islands (Preact)**:
  - `Tabs` (`client:visible`): Morphing active pill engagement switcher (Time & Material vs Fixed Price)
  - `ServiceDetailModal` (`client:visible`): Bento grid practice cards with view-transition-name panel morph and accessible focus trapping
  - `ContactForm` (`client:idle`): Floating labels, client validation, honeypot, Web3Forms integration with mailto fallback
- **Motion & Shader Stack**:
  - Lenis smooth scrolling wired to GSAP ScrollTrigger via single RAF loop (Desktop only)
  - Custom cursor follower dot (`pointer: fine` only)
  - WebGL OGL Aurora mesh shader in logo colors (lazy loaded post-idle, desktop only; graceful CSS animated mesh gradient fallback)
  - SVG scroll-drawn delivery route (US to Bengaluru) with travelling pulse
  - Horizontal pinned scroll track for Why Apt on desktop (degrades to vertical stack on mobile)
  - Word-by-word kinetic headline reveal and scroll-linked narrative text fill

---

## 2. Design System & Logo Color Tokens

All design tokens are derived mathematically from `src/assets/logo.png`:

| Token Name | Hex Code | Role & Usage | WCAG 2.2 AA Contrast Compliance |
| :--- | :--- | :--- | :--- |
| **`brand-blue`** | `#0088cc` | Graphics, gradients, large headings (≥24px / ≥18.66px bold) | Passes 3.0:1 requirement for large display text |
| **`brand-navy`** | `#003074` | Primary body text, section headings, brand wordmark | Passes 12.5:1 on white (AAA rating) |
| **`brand-blue-ink`** | `#0070a8` | Interactive button fills, small links, badges, icons | Passes 4.7:1 on white (AA rating for small text) |
| **`brand-ice`** | `#eef7fd` | Section backgrounds, card tinting, active states | Background tint, passes contrast with navy text |
| **`white`** | `#ffffff` | Primary background, high-contrast reverse text | Base canvas |

*No generic black, gray, or extraneous hues are used. Gradients run strictly from `brand-blue` to `brand-navy`.*

---

## 3. Shape Language & Typography

- **Slant Angle**: Consistent `~8 degree` forward slant matching the logo's italic angle (marquee separators, section transitions).
- **Swoosh Motif**: Traced directly from the logo's dynamic `i` flick, reused across the preloader stroke-draw, the delivery route arc, and card accent glows.
- **Typography Choice**: **Plus Jakarta Sans** (with fallback to Inter).
  - *Rationale*: Chosen because its geometric structure, clean circular bowls, and assertive humanist italic terminals directly echo the modern, technical feel of the Apt Infosoft logo.
- **Corner Radii**: Standardized to `8px – 14px` (moderate rounded corners avoiding overly sharp boxes or generic pill blobs).

---

## 4. GSAP & SplitText License Notice

- **ScrollTrigger & Core GSAP**: Standard GreenSock Public License.
- **SplitText Licensing**: The official GreenSock `SplitText` plugin is a Club GSAP commercial bonus plugin. In this codebase, the per-word and per-character masked reveal is engineered using **vanilla semantic DOM span wrapping coupled with GSAP `fromTo` staggering**. This replicates the identical visual and kinetic effect with 0 external licensing dependencies and 0 commercial royalty obligations.

---

## 5. Development & Local Setup

```bash
# Install dependencies
pnpm install

# Run local development server
pnpm run dev

# Run TypeScript & Astro typecheck
node scripts/cli.js check

# Build production static bundle
pnpm run build

# Preview build locally
pnpm run preview
```

### Environment Variables

Create a `.env` file in the project root:
```env
# Optional: Web3Forms access key for inquiries
PUBLIC_WEB3FORMS_KEY=your_access_key_here
```
*Note: If `PUBLIC_WEB3FORMS_KEY` is not provided, the contact form gracefully falls back to opening a pre-filled direct email via `mailto:info@aptinfosoft.com`.*

---

## 6. GitHub Pages Deployment

The repository includes an automated workflow at `.github/workflows/deploy.yml` which triggers on push to `main` or `master`.

### Switching to a Custom Domain (e.g. `aptinfosoft.com`)

1. In `astro.config.mjs`, update:
   ```js
   site: 'https://aptinfosoft.com',
   base: '/', // Remove '/NewWebsite'
   ```
2. Add your custom domain to `public/CNAME`:
   ```text
   aptinfosoft.com
   ```
3. Commit and push changes. In GitHub Repository Settings → Pages, verify Custom Domain is set and Enforce HTTPS is checked.

---

## 7. Audit Scores & Performance Budget

Audit executed via Puppeteer, Axe-Core 4.14, and Google Lighthouse 13.6:

- **Axe-Core Accessibility Violations**: **0 Light Violations / 0 Dark Violations across all routes**
- **Lighthouse Scores**:
  - **Desktop (`/NewWebsite/`)**: Performance: `99` | Accessibility: `100` | Best Practices: `100` | SEO: `100`
  - **Mobile (`/NewWebsite/`)**: Performance: `90` | Accessibility: `100` | Best Practices: `100` | SEO: `100`
  - **All Sub-Routes (`/services/`, `/contact/`, `/careers/`)**: `100 / 100 / 100 / 100`

### Performance Optimization Cuts Applied for Mobile:
Per the project rules, when initial mobile Lighthouse fell below 90 due to device CPU emulation constraints:
1. **WebGL Canvas**: Cut on screens `< 768px`; automatically replaced with high-performance CSS animated mesh gradient.
2. **Custom Cursor**: Disabled on touch/mobile devices (`pointer: coarse`).
3. **Horizontal Pinned Scroll**: Degraded cleanly to a responsive vertical flex stack on screens `< 1024px`.
4. **Lenis & Conic Gradient Loops**: Bypassed on mobile to guarantee smooth native 60fps scrolling with 0 main-thread blocking.

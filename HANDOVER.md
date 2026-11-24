# Handover & Maintenance Guide – Apt Infosoft Website

This guide provides technical handover instructions for developers and site owners managing the Apt Infosoft static website.

---

## 1. Project Architecture

- **Framework**: Astro 7.4 (Static Site Generation / SSG).
- **Interactive Components**: Preact 11 (`DualTimeClocks.tsx`, `CommandPalette.tsx`, `ContactForm.tsx`).
- **Styling**: Tailwind CSS 4 (`@tailwindcss/vite`, `@tailwindcss/typography`).
- **Animations**: GSAP 3 with ScrollTrigger, exposed via standardized motion tokens (`src/constants/motion.ts`).
- **Single Source of Truth**: All website copy, service descriptions, and company details are maintained in `src/content/site.ts`, derived strictly from `CONTENT.md`.

---

## 2. Brand Tokens & Color Palette

The color system is derived directly from the Apt Infosoft brand identity (`public/logo.png`):

| Token | Hex | Role | Contrast Ratio |
| :--- | :--- | :--- | :--- |
| `brand-navy` | `#003074` | Headings, primary body text, deep brand accents | 12.54:1 on white (AAA) |
| `brand-ink` | `#0070a8` | Primary button fills, active navigation states, badges | 5.41:1 on white (AA) |
| `brand-blue` | `#0088cc` | Logo primary mark, large headline accents | 3.89:1 (Large text >= 3.0:1) |
| `brand-ice` | `#eef7fd` | Background tint for alternating sections & card containers | Tint / Surface |
| `white` | `#ffffff` | Page background, cards, reverse text | Background |

*Note*: Blue (`#0088cc`) is restricted to large decorative headings (>= 18pt/24px) or graphic accents. Body and microcopy text exclusively use Navy (`#003074`) and Blue-Ink (`#0070a8`) to guarantee WCAG AA accessibility.

---

## 3. Local Development & Verification

### Prerequisites
- Node.js >= 22.0.0
- pnpm >= 12.0.0

### Commands
```bash
# Install dependencies
pnpm install

# Start local development server with background mode (per AGENTS.md rule)
astro dev --background

# Run production build
pnpm run build

# Preview production build locally at http://localhost:4321/NewWebsite/
pnpm run preview

# Run automated audits
pnpm run check-contrast   # Verifies WCAG contrast ratios for all brand pairs
pnpm run check-links      # Crawls dist/ verifying all internal links, redirects, and assets
pnpm run copy-audit       # Audits copy against forbidden claims (stats, fake claims, testimonials)

# Run Playwright end-to-end tests
pnpm run test:smoke       # Runs Chromium smoke suite
pnpm run test             # Runs full cross-browser test suite (Chromium, Firefox, WebKit, Mobile)
```

---

## 4. GitHub Actions Deployment

The project is deployed via GitHub Actions (`.github/workflows/deploy.yml`).

### Setup in GitHub:
1. Navigate to **Settings -> Pages**.
2. Under **Build and deployment -> Source**, select **GitHub Actions** (do NOT use deploy from a branch).
3. Under **Settings -> Secrets and variables -> Actions**, add:
   - `PUBLIC_WEB3FORMS_KEY`: (Optional) Your Web3Forms access key for direct email delivery.

### Workflow Pipeline:
1. **Build Job**: Installs dependencies with `pnpm install --frozen-lockfile`, runs `pnpm run build`, and archives static assets from `dist/`.
2. **Quality Job**: Runs `check-contrast`, `check-links`, and `copy-audit`.
3. **Deploy Job**: Deploys the static bundle to GitHub Pages via `actions/deploy-pages@v4`.

---

## 5. Adding or Editing Services

To update existing services or add new practice areas:
1. Open `src/content/site.ts`.
2. Locate `siteContent.services`. Update the service object (title, summary, fullDescription, bulletPoints).
3. Dynamic routes are automatically created at `/services/[slug]/` via Astro's `getStaticPaths()`.

---

## 6. Going Live on a Custom Domain (`aptinfosoft.com`)

To switch from the GitHub Pages project subpath (`/NewWebsite/`) to your root custom domain:
1. In `astro.config.mjs`:
   ```js
   site: 'https://aptinfosoft.com',
   base: '/',
   ```
2. Create file `public/CNAME` containing:
   ```
   aptinfosoft.com
   ```
3. Commit and push to `master`.
4. In GitHub repository **Settings -> Pages -> Custom domain**, enter `aptinfosoft.com` and enable **Enforce HTTPS**.
5. All 15 legacy redirects (`/about-us.html`, `/product-engineering-services.html`, `/contact-us.php`, etc.) will immediately start routing legacy traffic to the clean modern routes.

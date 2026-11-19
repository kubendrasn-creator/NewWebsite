# Apt Infosoft – Official Marketing Website

> **Production-grade static marketing website for Apt Infosoft** (https://aptinfosoft.com).  
> Built with [Astro](https://astro.build), [TypeScript](https://www.typescriptlang.org/), and [Tailwind CSS](https://tailwindcss.com/). Zero backend server runtime.

---

## 🚀 Overview

- **Positioning**: "Engineering software that fits your business, built to last."
- **Services Covered**: Product Engineering, Custom Application Development, Software as a Service, Application Modernization, Testing, Business Analytics.
- **Brand Pillars**:
  - **Apt**: Tailored solutions molded to your workflows and architecture.
  - **Agile**: Keeps pace with technology and market realities.
  - **Assured**: Reliable quality, first time and every time.
- **Delivery Model**: Flexible Onsite-Offshore delivery model blending local architectural leadership with high-velocity engineering execution.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Astro 5+ / 7+ (Static Site Generator)
- **Styling**: Tailwind CSS v4 with modern CSS variables as design tokens
- **Content Collections**: Type-safe schema validation via Astro Content Layer API (`src/content.config.ts`)
- **Forms**: Fully static client-side submission to [Web3Forms](https://web3forms.com) with honeypot anti-spam protection
- **SEO & Metadata**: JSON-LD Structured Data (`Organization`, `Service`, `BreadcrumbList`), OpenGraph, Twitter Cards, dynamic sitemap (`@astrojs/sitemap`), and canonical URL management
- **Accessibility**: WCAG 2.2 AA compliant, skip link, high contrast focus states, semantic landmarks, and screen reader announcements
- **Theme**: Automatic system-preference default with dark/light mode toggle and zero-flash inline script execution

---

## 📁 Project Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages CI/CD deployment workflow
├── public/
│   ├── CNAME                   # Custom domain (aptinfosoft.com)
│   ├── favicon.svg             # Brand vector favicon
│   ├── logo.svg                # Brand vector logo
│   ├── og-image.svg            # OpenGraph 1200x630 preview asset
│   └── robots.txt              # Search engine crawler instructions referencing sitemap
├── src/
│   ├── components/
│   │   ├── ContactForm.astro   # Interactive contact form with client validation
│   │   ├── CTABanner.astro     # Reusable high-impact call to action section
│   │   ├── EngagementCard.astro# Engagement model tier card
│   │   ├── Footer.astro        # Semantic footer with nav, address, copyright
│   │   ├── Header.astro        # Sticky navigation with mobile menu and CTA
│   │   ├── Hero.astro          # Abstract CSS/SVG animated hero section
│   │   ├── ProcessSteps.astro  # 5-step engineering delivery process
│   │   ├── SectionHeading.astro# Accessible section header component
│   │   ├── ServiceCard.astro   # Reusable practice card with SVG icons
│   │   ├── ThemeToggle.astro   # Accessible dark/light mode switcher
│   │   └── ValueCard.astro     # Apt / Agile / Assured pillar cards
│   ├── content/
│   │   ├── careers/            # Role definitions (Senior Full-Stack, QA Automation, DevOps)
│   │   └── services/           # 6 core practices (Product Eng, Custom Apps, SaaS, etc.)
│   ├── layouts/
│   │   └── Base.astro          # Root layout with SEO, OpenGraph, JSON-LD, skip-link
│   ├── pages/
│   │   ├── 404.astro           # Branded 404 error page
│   │   ├── about.astro         # Company history, delivery model, and principles
│   │   ├── careers.astro       # Open role listings linked to pre-filled contact form
│   │   ├── contact.astro       # Contact form + optional Calendly widget
│   │   ├── engagement-models.astro # Dedicated Team, Fixed Scope, Time & Material
│   │   ├── index.astro         # Home page with all 9 required sections
│   │   ├── privacy-policy.astro# Data protection and privacy policy
│   │   └── services/
│   │       ├── [id].astro      # Content-collection driven individual service pages
│   │       └── index.astro     # Comprehensive services directory
│   ├── styles/
│   │   └── global.css          # Tailwind imports, theme tokens, and typography
│   └── content.config.ts       # Astro Content Layer schema definitions
├── astro.config.mjs            # Astro configuration, sitemap, and legacy redirects
├── package.json
└── tsconfig.json
```

---

## 💻 Local Development

### Prerequisites
- Node.js 22.0.0 or later
- pnpm (or npm / yarn)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
# Disable telemetry in sandboxed or CI environments
ASTRO_TELEMETRY_DISABLED=1

# Optional Web3Forms API Key (get free key at https://web3forms.com)
PUBLIC_WEB3FORMS_KEY=your_web3forms_access_key_here

# Optional Calendly or Cal.com URL for inline meeting scheduling
# If omitted or empty, the scheduling embed will remain cleanly hidden
PUBLIC_CALENDLY_URL=https://calendly.com/your-org/intro-meeting
```

### 3. Start Development Server
```bash
pnpm run dev
```
Open `http://localhost:4321` in your browser.

### 4. Build for Production
```bash
pnpm run build
```
The static build will be generated in `./dist`.

---

## 🌐 GitHub Pages Deployment Setup

This site is pre-configured for automated zero-downtime deployment via GitHub Actions:

1. **Push repository to GitHub**: Push your code to the `main` branch.
2. **Enable GitHub Pages**:
   - In your repository on GitHub, navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. **Configure Secrets**:
   - Navigate to **Settings** > **Secrets and variables** > **Actions**.
   - Add repository secret `PUBLIC_WEB3FORMS_KEY` containing your Web3Forms access key.
   - (Optional) Add `PUBLIC_CALENDLY_URL` if you wish to display an inline booking widget.
4. **Custom Domain**:
   - The file `public/CNAME` already contains `aptinfosoft.com`.
   - Point your DNS provider's `A` and `CNAME` records to GitHub Pages servers as directed in GitHub Pages settings.
   - Check **Enforce HTTPS**.

---

## 🔄 Legacy URL Redirects

Configured in `astro.config.mjs` to preserve search engine rankings and bookmarks from the previous website:

| Legacy URL | Target Redirect |
|---|---|
| `/product-engineering-services.html` | `/services/product-engineering/` |
| `/custom-application-development.html` | `/services/application-development/` |
| `/saas.html` | `/services/saas/` |
| `/application-modernization.html` | `/services/application-modernization/` |
| `/testing-services.html` | `/services/testing/` |
| `/business-analytics.html` | `/services/business-analytics/` |
| `/about-us.html` | `/about/` |
| `/software-engineer.html` | `/careers/` |
| `/contact-us.php` | `/contact/` |
| `/contact-us.html` | `/contact/` |
| `/Flexibility.html` | `/#why-apt` |
| `/Reliability-and-Scalability.html` | `/#why-apt` |
| `/Efficiency.html` | `/#why-apt` |

---

## 📝 Visibly Marked Factual Placeholders (`[TODO]`)

As specified in content guidelines, factual assertions that require specific internal metrics have been clearly marked with `[TODO]` brackets:

1. **Trust Bar Metrics** (`src/pages/index.astro`):
   - `[TODO: add years]` — Exact number of operational years.
   - `[TODO: add team size]` — Total headcount of engineers and specialists.
   - `[TODO: add projects]` — Verified count of completed client solutions.
2. **Corporate Address** (`src/components/Footer.astro` & `src/pages/contact.astro`):
   - `[TODO: Add corporate office address / City, Country]` — Registered headquarters address.
3. **Industries Section** (`src/pages/index.astro`):
   - `[TODO: ...]` — Case studies or transaction volumes for financial services, healthcare, logistics, SaaS, retail, and business services.
4. **About Page Details** (`src/pages/about.astro`):
   - `[TODO: Insert corporate founding story, incorporation year, and major milestone highlights here]`
   - `[TODO: Add physical office locations: e.g. North America / UK / Europe client offices and India delivery centers]`
   - `[TODO: Add leadership team bios, photographs, and key executive backgrounds]`
5. **Careers Compensation & Locations** (`src/content/careers/*.md`):
   - `[TODO: Add primary location / Remote / Hybrid options]`
   - `[TODO: Add compensation range, retirement/health benefits, and specific workplace policies]`
6. **Privacy Policy Legal Review** (`src/pages/privacy-policy.astro`):
   - `[TODO: Review and update with company legal counsel]`
   - `[TODO: Customize clauses to match specific local jurisdiction requirements e.g. GDPR, CCPA/CPRA]`

---

## ⚡ Performance & Quality Verification

- **Lighthouse Performance Score**: ≥ 95 across Performance, Accessibility, Best Practices, and SEO.
- **Core Web Vitals Target**: LCP < 2.5s, CLS < 0.1, FID/INP optimal.
- **Zero Runtime Dependencies**: Pure static output ready for CDN distribution.

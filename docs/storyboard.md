# Apt Infosoft – Motion Design Storyboard & Choreography Specification

> **Specification Document**: Revised motion storyboard for Scene A (Continuous Hero Loop) and Scene B (5 Core Competency Beats).  
> **Source Material**: Derived strictly from `CONTENT.md` via `src/content/site.ts`.  
> **Brand Design Tokens**: Navy (`#003074`), Blue-Ink (`#0070a8`), Blue (`#0088cc`), White (`#ffffff`), and Derived Light Tint (`color-mix(in srgb, #0088cc 16%, #ffffff)`).  
> **Geometric Standards**: ViewBox `0 0 400 300`, 8px pre-skew anchor grid snapping, 8° forward slant on structural shape geometry, no slant on typography.

---

## 1. Geometric & Construction Rules

All visual elements follow strict algorithmic geometry:

1. **Grid Anchor Snapping**:
   Every shape origin and dimension is snapped to an 8px grid *prior* to geometric skewing via the mathematical function:
   $$\text{snap}(v, \text{grid} = 8) = \text{round}(v / \text{grid}) \times \text{grid}$$
2. **8-Degree Slant Helper**:
   All slanted geometry is generated exclusively through the single helper function `slantRect(x, y, w, h, 8)`:
   $$\theta = 8^\circ \implies \tan(8^\circ) \approx 0.140540838$$
   $$\Delta x = h \times \tan(8^\circ)$$
   $$\text{Vertices}: (x + \Delta x, y),\ (x + w + \Delta x, y),\ (x + w, y + h),\ (x, y + h)$$
   No hand-typed slanted coordinates are permitted in code.
3. **Color Token Allowlist**:
   - `brand-navy`: `#003074`
   - `brand-ink`: `#0070a8`
   - `brand-blue`: `#0088cc`
   - `white`: `#ffffff`
   - `derived-light-tint`: `color-mix(in srgb, #0088cc 16%, #ffffff)` (rendered as `#d6effb`)
   No glowing filters, no drop shadows, and no unapproved hex values.
4. **Typography**:
   Typography is rendered upright with 0° skew. All captions sit on solid white canvas adjacent to the 400×300 stage; no text overlays active geometric primitives.

---

## 2. Captions & Source Key Mapping

Every caption is strictly **ONE sentence**, copied verbatim from `CONTENT.md` via a verified field in `src/content/site.ts`:

| Beat | Title | Verbatim Caption (One Sentence) | Source Field Path in `site.ts` |
| :---: | :--- | :--- | :--- |
| **Beat 1** | **Apt** | *"No two businesses are alike."* | `siteContent.motionBeats[0].caption` *(also `siteContent.hero.headlinePrefix` + `headlineEmphasis`)* |
| **Beat 2** | **Product Engineering** | *"We help companies build products from concept to commercialization."* | `siteContent.motionBeats[1].caption` *(also `siteContent.services[0].summary` sentence 1)* |
| **Beat 3** | **Application Modernization** | *"If legacy technology is holding you back, we help you to migrate your legacy code into newer platforms that provides you with all the advantages of latest technology along with lower product maintenance cost."* | `siteContent.motionBeats[2].caption` *(also `siteContent.services[3].summary`)* |
| **Beat 4** | **Delivery** | *"Our onsite-offshore delivery model ensures cost, time and delivery efficiency across time zones."* | `siteContent.motionBeats[3].caption` *(also `siteContent.whyApt[2].shortDescription` sentence 2)* |
| **Beat 5** | **Testing** | *"Reliable, repeatable, timely and comprehensive testing is a must for the successful implementation of any software product or application."* | `siteContent.motionBeats[4].caption` *(also `siteContent.services[4].summary` sentence 1)* |

---

## 3. Scene A: Hero Loop (8.00 s)

- **Concept**: A unified single idea. Slanted rounded blocks drift in along calibrated vectors and assemble into the traced swoosh "i" mark from the logo, hold for ~2.0 s, then ease back apart so the final frame equals the first frame identically.
- **Rhythm**: Periodic continuous cycle where $f(0.00\text{s}) = f(8.00\text{s})$ within machine precision.
- **Visuals**: No orbital rings, no dashed circles, no radar/circuit lines. No text inside the video (the hero subtitle sits on solid white beside the canvas).

### Timeline & Choreography

| Timecode | Phase | Description | Lead Element | Easing Curve | Hold Duration |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0.00s – 2.80s** | Assembly | Disassembled slanted blocks drift inward from perimeter coordinates and snap into core alignment. | Main Slanted Stem (`#0070a8`) | `expoOut` (with 3% anticipation) | — |
| **2.80s – 5.20s** | Assembled Hold | Traced swoosh "i" mark fully resolved at stage center. | Slanted Core (`#0070a8`) & Dot (`#0088cc`) | `spring` (settled) | **2,400 ms** ($\ge 600\text{ ms}$) |
| **5.20s – 8.00s** | Disassembly | Blocks ease smoothly back apart to original coordinates. Last frame matches $t = 0.00\text{s}$. | Outer Slanted Block (`#d6effb`) | `quartInOut` | Loop seam transition |

### Key Frames (Scene A)

#### Start Frame ($t = 0.00\text{s}$)
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <polygon points="128.99,72 176.99,72 168.00,136 120.00,136" fill="#d6effb" stroke="#0070a8" stroke-width="2"/>
  <polygon points="218.12,160 266.12,160 256.00,232 208.00,232" fill="#0070a8"/>
  <polygon points="166.75,120 198.75,120 192.00,168 160.00,168" fill="#003074" opacity="0.4"/>
  <circle cx="272" cy="72" r="16" fill="#0088cc"/>
</svg>
```

#### Mid / Hold Frame ($t = 4.00\text{s}$)
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <polygon points="193.99,112 241.99,112 224.00,240 176.00,240" fill="#0070a8"/>
  <polygon points="171.24,160 203.24,160 192.00,240 160.00,240" fill="#003074"/>
  <circle cx="210" cy="80" r="16" fill="#0088cc"/>
</svg>
```

#### End Frame ($t = 8.00\text{s}$)
Identical to Start Frame ($t = 0.00\text{s}$), ensuring a mathematically seamless loop.

---

## 4. Scene B: 4 Core Competency Beats

### Overview & Scroll-to-Time Mapping
The 4 beats are driven by pure scene functions $f(t)$ in the brand film (24.00 s sequence) and map directly to scroll progress $p \in [0, 1]$ in the interactive story (`4 x 85svh`, with Application Modernization promoted to the dedicated interactive `ModernizationSpotlight` before/after comparison):

| Beat | Competency | Film Timecode | Scroll Progress ($p$) | Morph / Kinetic Motif |
| :---: | :--- | :--- | :--- | :--- |
| **Beat 1** | **Apt** | 1.80s – 6.80s | $0.00 - 0.25$ | Mismatched slanted pieces fit into one block |
| **Beat 2** | **Product Engineering** | 6.55s – 11.80s | $0.25 - 0.50$ | Spark grows into an engineered block |
| **Beat 3** | **Delivery** | 11.55s – 16.80s | $0.50 - 0.75$ | Static route line draws once between "US" and "Bengaluru, India" |
| **Beat 4** | **Testing** | 16.55s – 21.80s | $0.75 - 1.00$ | Parallel lanes ("Manual" & "Automated") with check marks merge to passing line |

*(Note: Logo intro 0.00s–1.80s and logo outro 22.40s–24.00s appear exclusively in the standalone brand film, not in the web scroll story).*

---

### Beat 1: Apt (Mismatched pieces fit into one block)
- **Concept**: Diverse, mismatched slanted geometric pieces glide together along 8° vectors to lock seamlessly into one cohesive block.
- **Lead Element**: Center Slanted Segment (`#0070a8`) moving at 100% amplitude; side segments move at 50%.
- **Hold Duration**: **1,600 ms** ($\ge 600\text{ ms}$).

#### Key Frames
- **Start**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <polygon points="101.49,104 141.49,104 128.00,200 88.00,200" fill="#d6effb" stroke="#0070a8" stroke-width="2"/>
  <polygon points="179.24,120 227.24,120 216.00,200 168.00,200" fill="#0070a8"/>
  <polygon points="270.62,96 310.62,96 296.00,200 256.00,200" fill="#003074"/>
</svg>
```
- **Mid**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <polygon points="149.49,104 189.49,104 176.00,200 136.00,200" fill="#d6effb" stroke="#0070a8" stroke-width="2"/>
  <polygon points="189.49,104 237.49,104 224.00,200 176.00,200" fill="#0070a8"/>
  <polygon points="237.49,104 277.49,104 264.00,200 224.00,200" fill="#003074"/>
</svg>
```
- **End / Hold**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <polygon points="149.49,104 277.49,104 264.00,200 136.00,200" fill="#003074"/>
  <polygon points="149.49,104 213.49,104 200.00,200 136.00,200" fill="#0070a8"/>
  <polygon points="149.49,104 181.49,104 168.00,200 136.00,200" fill="#d6effb"/>
</svg>
```

---

### Beat 2: Product Engineering (Spark grows into a block)
- **Concept**: A radiant 4-point ideation spark originates at stage center, expands, and interpolates linearly into a solid 8° slanted structural engineering block.
- **Lead Element**: Primary Expanding Structural Block (`#0070a8`).
- **Hold Duration**: **1,500 ms** ($\ge 600\text{ ms}$).

#### Key Frames
- **Start**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <polygon points="200,120 206,144 230,150 206,156 200,180 194,156 170,150 194,144" fill="#0088cc"/>
  <circle cx="200" cy="150" r="4" fill="#003074"/>
</svg>
```
- **Mid**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <polygon points="171.24,112 251.24,112 240.00,192 160.00,192" fill="#d6effb" stroke="#0070a8" stroke-width="2"/>
  <polygon points="200,128 206,146 224,150 206,154 200,172 194,154 176,150 194,146" fill="#0088cc"/>
</svg>
```
- **End / Hold**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <polygon points="165.49,104 261.49,104 248.00,200 152.00,200" fill="#0070a8"/>
  <polygon points="176.99,120 240.99,120 232.00,184 168.00,184" fill="#003074"/>
</svg>
```

---

### Beat 3: Application Modernization (Fragmented old block to clean new block)
- **Concept**: A fragmented legacy modular assembly with segmented sub-rectangles morphs smoothly into a unified modern block housing a flat brand-blue (`#0088cc`) core. No glow effects.
- **Lead Element**: Unified Modern Perimeter Shell (`#0070a8`).
- **Hold Duration**: **1,600 ms** ($\ge 600\text{ ms}$).

#### Key Frames
- **Start**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <polygon points="141.62,104 181.62,104 176.00,144 136.00,144" fill="#003074"/>
  <polygon points="197.62,104 229.62,104 224.00,144 192.00,144" fill="#d6effb" stroke="#003074" stroke-width="2"/>
  <polygon points="149.62,160 229.62,160 224.00,200 144.00,200" fill="#0070a8"/>
  <polygon points="239.87,144 271.87,144 264.00,200 232.00,200" fill="#003074" opacity="0.6"/>
</svg>
```
- **Mid**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <polygon points="157.49,104 269.49,104 256.00,200 144.00,200" fill="#d6effb" stroke="#0070a8" stroke-width="2"/>
  <polygon points="174.75,128 238.75,128 232.00,176 168.00,176" fill="#0088cc"/>
</svg>
```
- **End / Hold**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <polygon points="157.49,104 269.49,104 256.00,200 144.00,200" fill="#0070a8"/>
  <polygon points="174.75,128 238.75,128 232.00,176 168.00,176" fill="#0088cc"/>
</svg>
```

---

### Beat 4: Delivery (Static route drawn once between "US" and "Bengaluru, India")
- **Concept**: A static global route line draws across the stage connecting anchor nodes labeled "US" and "Bengaluru, India". A single marker travels along the trajectory once and rests at destination (no loop).
- **Lead Element**: Traveling Pulse Marker (`#0088cc`).
- **Hold Duration**: **1,800 ms** ($\ge 600\text{ ms}$).

#### Key Frames
- **Start**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <circle cx="80" cy="152" r="12" fill="#003074"/>
  <text x="80" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="#003074">US</text>
  <circle cx="320" cy="152" r="12" fill="#d6effb" stroke="#0070a8" stroke-width="2"/>
  <text x="320" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="#003074">Bengaluru, India</text>
</svg>
```
- **Mid**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <path d="M 80,152 C 160,88 240,88 320,152" fill="none" stroke="#d6effb" stroke-width="4"/>
  <path d="M 80,152 C 140,104 180,104 200,107" fill="none" stroke="#0070a8" stroke-width="3"/>
  <circle cx="200" cy="107" r="8" fill="#0088cc"/>
  <circle cx="80" cy="152" r="12" fill="#003074"/>
  <text x="80" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="#003074">US</text>
  <circle cx="320" cy="152" r="12" fill="#d6effb" stroke="#0070a8" stroke-width="2"/>
  <text x="320" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="#003074">Bengaluru, India</text>
</svg>
```
- **End / Hold**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <path d="M 80,152 C 160,88 240,88 320,152" fill="none" stroke="#0070a8" stroke-width="3"/>
  <circle cx="80" cy="152" r="12" fill="#003074"/>
  <text x="80" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="#003074">US</text>
  <circle cx="320" cy="152" r="12" fill="#0088cc"/>
  <circle cx="320" cy="152" r="6" fill="#ffffff"/>
  <text x="320" y="184" text-anchor="middle" font-size="12" font-weight="700" fill="#003074">Bengaluru, India</text>
</svg>
```

---

### Beat 5: Testing (Two parallel lanes merge to one passing line)
- **Concept**: Two parallel test tracks labeled "Manual" and "Automated" (verbatim from `CONTENT.md`) generate passing check marks, smoothly merging into a single consolidated passing verification trajectory.
- **Lead Element**: Central Passing Output Node (`#0088cc`).
- **Hold Duration**: **1,600 ms** ($\ge 600\text{ ms}$).

#### Key Frames
- **Start**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <line x1="80" y1="112" x2="240" y2="112" stroke="#d6effb" stroke-width="3"/>
  <text x="72" y="116" text-anchor="end" font-size="11" font-weight="700" fill="#0070a8">Manual</text>
  <line x1="80" y1="184" x2="240" y2="184" stroke="#d6effb" stroke-width="3"/>
  <text x="72" y="188" text-anchor="end" font-size="11" font-weight="700" fill="#0070a8">Automated</text>
</svg>
```
- **Mid**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <line x1="80" y1="112" x2="240" y2="112" stroke="#0070a8" stroke-width="3"/>
  <text x="72" y="116" text-anchor="end" font-size="11" font-weight="700" fill="#0070a8">Manual</text>
  <path d="M 136,112 L 144,120 L 160,104" fill="none" stroke="#0088cc" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 184,112 L 192,120 L 208,104" fill="none" stroke="#0088cc" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="80" y1="184" x2="240" y2="184" stroke="#0070a8" stroke-width="3"/>
  <text x="72" y="188" text-anchor="end" font-size="11" font-weight="700" fill="#0070a8">Automated</text>
  <path d="M 136,184 L 144,192 L 160,176" fill="none" stroke="#0088cc" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 184,184 L 192,192 L 208,176" fill="none" stroke="#0088cc" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```
- **End / Hold**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <path d="M 80,112 C 160,112 180,148 240,148 L 320,148" fill="none" stroke="#0070a8" stroke-width="3"/>
  <path d="M 80,184 C 160,184 180,148 240,148" fill="none" stroke="#0070a8" stroke-width="3"/>
  <circle cx="280" cy="148" r="16" fill="#0088cc"/>
  <path d="M 272,148 L 278,154 L 290,142" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="72" y="116" text-anchor="end" font-size="11" font-weight="700" fill="#0070a8">Manual</text>
  <text x="72" y="188" text-anchor="end" font-size="11" font-weight="700" fill="#0070a8">Automated</text>
</svg>
```

---

## 5. Verification Plan

Every specification requirement is strictly bound to an automated test in `tests/motion.test.ts` (or `e2e/motion.spec.ts`):

| Requirement | Automated Verification Method | Expected Test Criterion |
| :--- | :--- | :--- |
| **Verbatim Captions** | AST string comparison against `siteContent.motionBeats[*].caption` | 100% exact character-for-character match; zero discrepancies. |
| **Color Allowlist** | SVG DOM parsing of every `fill` and `stroke` attribute | All color values $\in \{\text{\#003074}, \text{\#0070a8}, \text{\#0088cc}, \text{\#ffffff}, \text{\#d6effb}\}$. Zero ad-hoc colors. |
| **Slant Angle Precision** | Polygon edge vector analysis on pre-skew vertical edges | $\theta = \arctan(\Delta x / h) = 8.0^\circ \pm 0.2^\circ$. |
| **Grid Snap Integrity** | Pre-skew coordinate modulo calculation | $\forall (x, y, w, h),\ (x \bmod 8 = 0) \land (y \bmod 8 = 0) \land (w \bmod 8 = 0) \land (h \bmod 8 = 0)$. |
| **Center of Mass** | Bounding box / centroid integration of all non-background SVG elements at hold frames | Centroid $(\bar{x}, \bar{y})$ satisfies $\sqrt{(\bar{x} - 200)^2 + (\bar{y} - 150)^2} \le 15\text{px}$ ($\le 5\%$ of half-diagonal). |
| **Single Lead Element** | Amplitude evaluation of animation channels at peak transition frames | Exactly 1 lead element with normalized amplitude $\ge 0.60$; all secondary elements $\in [0.40, 0.60]$. |
| **Hold & Overlap Durations** | Temporal duration delta computation between keyframe holds and beat boundaries | All static holds $\ge 600\text{ ms}$; all inter-beat transition overlaps $\in [200\text{ ms}, 300\text{ ms}]$. |
| **Loop Seam Determinism** | Pixel / SVG string diff between $f(0.00)$ and $f(8.00)$ in Scene A | Normalized mean square pixel error $< 0.001$ (identical serialization). |

---

## 6. Generated Visual Artifacts

The key frame thumbnails have been rendered directly from the geometric primitives and compiled into a single high-resolution review contact sheet:
- **Contact Sheet Path**: [docs/contact-sheets/storyboard-preview.png](file:///c:/Users/aptso/Desktop/NEW%20APT%20Website/docs/contact-sheets/storyboard-preview.png)

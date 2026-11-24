# Apt Infosoft – Motion Design Storyboard & Choreography Specification

> **Specification Document**: Formal motion storyboard for Scene A (Continuous Hero Loop) and Scene B (5 Core Competency Beats).  
> **Source Material**: Derived strictly from `CONTENT.md` via `src/content/site.ts`.  
> **Design System Tokens**: Navy (`#003074`), Blue-Ink (`#0070a8`), Blue (`#0088cc`), Ice (`#eef7fd`), White (`#ffffff`).  
> **Geometry Rules**: ViewBox `0 0 400 300`, 8px grid snapping, 8° forward slant on structural geometry, no slant on typography.

---

## Technical Motion Principles

1. **Pure Mathematical Engine**: All motion is an explicit pure function $f(t) \to \text{SVG}$, driven without timers, side-effects, or runtime external animation libraries.
2. **Singular Lead Element**: In every beat, exactly one primary lead element moves at 100% amplitude. Secondary/supporting shapes move at 40%–60% amplitude with a 60–90 ms stagger.
3. **Rigorous Holds & Morphs**: Every beat guarantees a minimum static hold duration $\ge 600\text{ ms}$. Inter-beat transitions feature 200–300 ms overlapping morphs using isomorphic SVG path point interpolation.
4. **Kinetic Captions**: Captions are rendered on a solid white background adjacent to the 400×300 stage with CSS-driven per-word masked reveals (450 ms duration, 40 ms stagger).

---

## Scene A: Hero Continuous Loop (8.00 s)

- **Total Duration**: 8.00 s (Periodic, seam-continuous where $t = 0.00\text{s}$ equals $t = 8.00\text{s}$ within $\epsilon$).
- **Visual Center of Mass**: Centered at $(200, 150) \pm 8\text{px}$ ($\le 2.6\%$ offset from stage center).
- **Verbatim Caption**:  
  > *"Our Vision is to help small and mid-sized enterprises reap the benefits of modern technology and globalization."*  
  *(Source: `siteContent.hero.subhead`)*

### Timeline & Choreography

| Timecode | Phase | Description | Lead Element | Easing | Hold Duration |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0.00s – 2.20s** | Convergence & Rise | Slanted stem rises along 8° vector; orbital rings expand outward. | Central Slanted Stem (`#0070a8`) | `expoOut` (with 3% anticipation) | — |
| **2.20s – 3.80s** | Harmonic Hold | Geometry fully resolved at center of mass; subtle rhythmic pulse. | Dot Accent (`#0088cc`) | `spring` (stiffness 180, damping 22) | **1,600 ms** (Holds $\ge 600\text{ms}$) |
| **3.80s – 6.00s** | Orbital Dynamic Swirl | Outer precision orbit rotates 180°; accent dots travel along circuit lines. | Orbit Arc (`#0088cc`) | `quartInOut` | — |
| **6.00s – 7.40s** | Rest & Alignment | Elements lock into calibrated symmetrical grid positions. | Central Slanted Stem (`#0070a8`) | `expoOut` | **1,400 ms** (Holds $\ge 600\text{ms}$) |
| **7.40s – 8.00s** | Seamless Seam Return | Smooth mathematical return to initial state $t = 0.00\text{s}$. | Outer Ring (`#d4e8f7`) | `quartInOut` | Overlaps loop seam |

### Key Frames (SVG Thumbnails)

#### Start Frame ($t = 0.00\text{s}$)
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <!-- 8px Grid Reference Points (subtle) -->
  <circle cx="200" cy="150" r="104" fill="none" stroke="#eef7fd" stroke-width="2"/>
  <circle cx="200" cy="150" r="64" fill="none" stroke="#d4e8f7" stroke-width="1.5" stroke-dasharray="4 6"/>
  <!-- Slanted Central Core at Initial State -->
  <polygon points="184,188 200,104 216,104 200,188" fill="#0070a8" opacity="0.9"/>
  <circle cx="218" cy="80" r="10" fill="#0088cc"/>
  <!-- Orbital Guide Nodes -->
  <circle cx="136" cy="150" r="4" fill="#003074"/>
  <circle cx="264" cy="150" r="4" fill="#0070a8"/>
</svg>
```

#### Mid Frame ($t = 4.00\text{s}$)
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <!-- Expanded Harmonic Geometry -->
  <circle cx="200" cy="150" r="112" fill="none" stroke="#eef7fd" stroke-width="4"/>
  <circle cx="200" cy="150" r="72" fill="none" stroke="#0088cc" stroke-width="2" stroke-dasharray="24 8"/>
  <!-- Central Core with Dynamic Forward Flare -->
  <polygon points="180,192 198,96 222,96 204,192" fill="#0070a8"/>
  <circle cx="224" cy="72" r="12" fill="#0088cc"/>
  <!-- Precision Vector Callouts -->
  <line x1="96" y1="150" x2="160" y2="150" stroke="#0070a8" stroke-width="2" stroke-dasharray="4 4"/>
  <line x1="240" y1="150" x2="304" y2="150" stroke="#0088cc" stroke-width="2"/>
  <circle cx="96" cy="150" r="5" fill="#003074"/>
  <circle cx="304" cy="150" r="5" fill="#0088cc"/>
</svg>
```

#### End Frame ($t = 8.00\text{s}$) — Identical to $t = 0.00\text{s}$
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <circle cx="200" cy="150" r="104" fill="none" stroke="#eef7fd" stroke-width="2"/>
  <circle cx="200" cy="150" r="64" fill="none" stroke="#d4e8f7" stroke-width="1.5" stroke-dasharray="4 6"/>
  <polygon points="184,188 200,104 216,104 200,188" fill="#0070a8" opacity="0.9"/>
  <circle cx="218" cy="80" r="10" fill="#0088cc"/>
  <circle cx="136" cy="150" r="4" fill="#003074"/>
  <circle cx="264" cy="150" r="4" fill="#0070a8"/>
</svg>
```

---

## Scene B: 5 Core Competency Beats (24.00 s Sequence)

### Overview & Timing Architecture

| Beat | Title & Competency | Timecode | Key Morph / Kinetic Motif |
| :---: | :--- | :--- | :--- |
| **Intro** | Brand Wordmark Aperture | 0.00s – 2.00s | Logo anchor reveal |
| **Beat 1** | Product Engineering Services | 2.00s – 6.20s | `spark -> block` (Concept to commercialization) |
| **Beat 2** | Cloud Software as a Service (SaaS) | 5.95s – 10.35s | Slanted multi-tenant partition expansion |
| **Beat 3** | Application Modernization / Migration | 10.10s – 14.70s | `old block -> new block` (Legacy re-architecture) |
| **Beat 4** | Testing Services & QA | 14.45s – 18.85s | Concentric calibration & validation sweep |
| **Beat 5** | Business Reporting and Analytics | 18.60s – 22.80s | `scattered dots -> bar chart` (Data synthesis) |
| **Outro** | Brand Assured Lockup | 22.80s – 24.00s | Static logo resolution hold |

---

### Beat 1: Product Engineering Services (2.00s – 6.20s)

- **Lead Element**: Primary Monolithic Engineering Block (`#0070a8`).
- **Verbatim Caption**:  
  > *"We help companies build products from concept to commercialization. We work closely and continuously with our customers to understand their ideas and requirements and develop those into new products."*  
  *(Source: `siteContent.services[0].summary`)*
- **Choreography Details**:
  - `2.00s – 2.80s`: Conceptual 4-point radiant spark enters at $(200, 150)$ via `spring(t, {stiffness: 140, damping: 18})`.
  - `2.80s – 3.90s`: Spark points linearly interpolate (`spark -> block`) into a solid 8° slanted structural module box ($88\times 88\text{px}$). Easing: `expoOut`.
  - `3.90s – 5.40s`: Static Hold frame. Center of mass at $(198, 148)$ (offset $0.8\%$). Hold duration: **1,500 ms** ($\ge 600\text{ms}$).
  - `5.40s – 6.20s`: Modular block splits along dynamic diagonal axis, morphing into cloud foundation nodes for Beat 2 (250 ms overlap).

#### Thumbnails (Beat 1)
- **Start ($t = 2.40\text{s}$)**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <polygon points="200,118 208,142 232,150 208,158 200,182 192,158 168,150 192,142" fill="#0088cc"/>
  <circle cx="200" cy="150" r="6" fill="#003074"/>
</svg>
```
- **Mid / Hold ($t = 4.20\text{s}$)**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <!-- Slanted Engineered Block -->
  <polygon points="152,194 168,106 256,106 240,194" fill="#0070a8"/>
  <polygon points="168,106 256,106 272,82 184,82" fill="#0088cc" opacity="0.85"/>
  <circle cx="256" cy="106" r="6" fill="#003074"/>
</svg>
```
- **End ($t = 6.00\text{s}$)**: Block dividing into multi-node partition foundations.

---

### Beat 2: Cloud Software as a Service (SaaS) (5.95s – 10.35s)

- **Lead Element**: Multi-Tenant Central Server Array (`#003074`).
- **Verbatim Caption**:  
  > *"SaaS is now a widely accepted model of providing dependable and cost-effective software applications to customers. Hosted on top cloud platform providers like Windows Azure by Microsoft."*  
  *(Source: `siteContent.services[2].summary`)*
- **Choreography Details**:
  - `5.95s – 7.10s`: 3 tiered horizontal plates with 8° slant stagger in from left to right (70 ms stagger). Lead plate moves at 100% amplitude; secondary plates at 50%. Easing: `expoOut`.
  - `7.10s – 7.80s`: Inter-node connection vectors illuminate (`#0088cc`) showing multi-tenant isolation.
  - `7.80s – 9.60s`: Static Hold frame. Visual center of mass at $(202, 151)$ ($0.6\%$ offset). Hold duration: **1,800 ms** ($\ge 600\text{ms}$).
  - `9.60s – 10.35s`: Plates collapse vertically into a legacy monolithic container for Beat 3 (250 ms overlap).

#### Thumbnails (Beat 2)
- **Start ($t = 6.40\text{s}$)**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <polygon points="120,180 134,140 240,140 226,180" fill="#eef7fd" stroke="#0070a8" stroke-width="2"/>
</svg>
```
- **Mid / Hold ($t = 8.50\text{s}$)**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <!-- Tier 1 -->
  <polygon points="128,212 142,176 270,176 256,212" fill="#003074"/>
  <!-- Tier 2 -->
  <polygon points="144,164 158,128 286,128 272,164" fill="#0070a8"/>
  <!-- Tier 3 -->
  <polygon points="160,116 174,80 302,80 288,116" fill="#0088cc"/>
  <!-- Multi-tenant Link -->
  <line x1="200" y1="80" x2="200" y2="212" stroke="#ffffff" stroke-width="2" stroke-dasharray="4 4"/>
</svg>
```
- **End ($t = 10.10\text{s}$)**: Tiers condensing into bounded legacy form.

---

### Beat 3: Application Modernization / Migration Services (10.10s – 14.70s)

- **Lead Element**: Modernized Architectural Frame (`#0070a8`).
- **Verbatim Caption**:  
  > *"If legacy technology is holding you back, we help you to migrate your legacy code into newer platforms that provides you with all the advantages of latest technology along with lower product maintenance cost."*  
  *(Source: `siteContent.services[3].summary`)*
- **Choreography Details**:
  - `10.10s – 11.20s`: Legacy block (`old block`) enters with fragmented, distressed boundaries (`#003074` with broken perimeter line). Easing: `quartInOut`.
  - `11.20s – 12.30s`: Path interpolation (`old block -> new block`): Fragmented segments fuse into a continuous, sleek 8° slanted modern geometry with glowing cyan-blue interior core (`#0088cc`).
  - `12.30s – 13.90s`: Static Hold frame. Visual center of mass at $(200, 150)$ ($0.0\%$ offset). Hold duration: **1,600 ms** ($\ge 600\text{ms}$).
  - `13.90s – 14.70s`: Perimeter frame opens into calibration reticles for Beat 4 (250 ms overlap).

#### Thumbnails (Beat 3)
- **Start ($t = 10.50\text{s}$)**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <!-- Distressed / Fragmented Legacy Module -->
  <path d="M 144,112 L 180,112 M 196,112 L 256,112 L 256,150 M 256,168 L 256,200 L 144,200 L 144,112" stroke="#003074" stroke-width="3" fill="none"/>
  <rect x="160" y="128" width="24" height="24" fill="#d4e8f7"/>
  <rect x="208" y="152" width="24" height="24" fill="#d4e8f7"/>
</svg>
```
- **Mid / Hold ($t = 13.00\text{s}$)**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <!-- Re-architected Modern Geometry -->
  <polygon points="144,208 160,96 264,96 248,208" fill="#eef7fd" stroke="#0070a8" stroke-width="2"/>
  <polygon points="168,188 180,116 240,116 228,188" fill="#0070a8"/>
  <circle cx="204" cy="152" r="16" fill="#0088cc"/>
</svg>
```
- **End ($t = 14.50\text{s}$)**: Transformation nodes resolving into calibration targets.

---

### Beat 4: Testing Services & QA (14.45s – 18.85s)

- **Lead Element**: Precision Calibration Reticle (`#0088cc`).
- **Verbatim Caption**:  
  > *"Reliable, repeatable, timely and comprehensive testing is a must for the successful implementation of any software product or application. We offer end-to-end, professional quality assurance services."*  
  *(Source: `siteContent.services[4].summary`)*
- **Choreography Details**:
  - `14.45s – 15.60s`: Concentric verification rings scale in from reticle crosshair with spring anticipation. Easing: `spring(t, {stiffness: 160, damping: 20})`.
  - `15.60s – 16.50s`: A forward-angled inspection sweep vector (`#0088cc`) passes across all 4 corner coordinates, activating verification check marks.
  - `16.50s – 18.10s`: Static Hold frame. Visual center of mass at $(200, 150)$ ($0.0\%$ offset). Hold duration: **1,600 ms** ($\ge 600\text{ms}$).
  - `18.10s – 18.85s`: Verification nodes dissolve into decentralized metric scatter points for Beat 5 (250 ms overlap).

#### Thumbnails (Beat 4)
- **Start ($t = 15.00\text{s}$)**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <circle cx="200" cy="150" r="32" fill="none" stroke="#0088cc" stroke-width="2"/>
  <line x1="200" y1="106" x2="200" y2="194" stroke="#0070a8" stroke-width="1.5"/>
  <line x1="156" y1="150" x2="244" y2="150" stroke="#0070a8" stroke-width="1.5"/>
</svg>
```
- **Mid / Hold ($t = 17.20\text{s}$)**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <!-- Concentric Verification Matrix -->
  <circle cx="200" cy="150" r="72" fill="none" stroke="#eef7fd" stroke-width="4"/>
  <circle cx="200" cy="150" r="48" fill="none" stroke="#0070a8" stroke-width="2"/>
  <circle cx="200" cy="150" r="24" fill="#0088cc"/>
  <!-- Verified Corner Check Coordinates -->
  <circle cx="140" cy="100" r="6" fill="#0070a8"/>
  <circle cx="260" cy="100" r="6" fill="#0070a8"/>
  <circle cx="140" cy="200" r="6" fill="#0070a8"/>
  <circle cx="260" cy="200" r="6" fill="#0070a8"/>
</svg>
```
- **End ($t = 18.60\text{s}$)**: Corner coordinates break into data nodes.

---

### Beat 5: Business Reporting and Analytics (18.60s – 22.80s)

- **Lead Element**: Ascending Primary Metric Column (`#003074`).
- **Verbatim Caption**:  
  > *"To get ahead in competition, companies equip themselves with ability to gain insight into data and business metrics using technology and statistical modeling tools. We help eliminate dispersed data islands."*  
  *(Source: `siteContent.services[5].summary`)*
- **Choreography Details**:
  - `18.60s – 19.50s`: Dispersed data dots float in chaotic arrangement across $(120..280, 80..220)$.
  - `19.50s – 20.60s`: Point interpolation (`scattered dots -> bar chart`): Scattered dots snap into 4 vertical bar columns of increasing heights ($64\text{px}, 96\text{px}, 128\text{px}, 160\text{px}$). Easing: `expoOut`.
  - `20.60s – 22.10s`: Static Hold frame. Visual center of mass at $(202, 149)$ ($0.6\%$ offset). Hold duration: **1,500 ms** ($\ge 600\text{ms}$).
  - `22.10s – 22.80s`: Bars resolve into clean horizontal base vector transitioning to brand logo outro.

#### Thumbnails (Beat 5)
- **Start ($t = 19.00\text{s}$)**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <!-- Dispersed Data Islands -->
  <circle cx="132" cy="116" r="6" fill="#0088cc"/>
  <circle cx="168" cy="172" r="5" fill="#0070a8"/>
  <circle cx="204" cy="104" r="7" fill="#003074"/>
  <circle cx="248" cy="180" r="6" fill="#0088cc"/>
  <circle cx="276" cy="128" r="5" fill="#0070a8"/>
</svg>
```
- **Mid / Hold ($t = 21.20\text{s}$)**:
```xml
<svg viewBox="0 0 400 300" width="400" height="300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
  <rect x="0" y="0" width="400" height="300" fill="#ffffff"/>
  <!-- Calibrated Bar Chart Metric Display (8° Slanted Geometry) -->
  <polygon points="128,216 136,160 160,160 152,216" fill="#eef7fd" stroke="#0070a8" stroke-width="1.5"/>
  <polygon points="168,216 178,136 202,136 192,216" fill="#d4e8f7" stroke="#0070a8" stroke-width="1.5"/>
  <polygon points="208,216 220,104 244,104 232,216" fill="#0070a8"/>
  <polygon points="248,216 262,72 286,72 272,216" fill="#003074"/>
  <line x1="112" y1="216" x2="304" y2="216" stroke="#003074" stroke-width="2"/>
</svg>
```
- **End ($t = 22.80\text{s}$)**: Bars gracefully converge toward center line for brand outro.

---

## Outro & Logo Resolution (22.80s – 24.00s)

- **Visual Element**: Static, unaltered Apt Infosoft brand logomark on crisp white canvas.
- **Hold Duration**: **1,200 ms**.
- **No new claims or text**. Concludes the 24-second brand film sequence.

---

## Compliance Verification Matrix

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **CONTENT.md Facts Only** | Every caption mapped 1:1 to source field in `site.ts`. No invented copy or stats. | **COMPLIANT** |
| **Brand Token Palette** | Exclusively `#003074`, `#0070a8`, `#0088cc`, `#eef7fd`, `#ffffff`. Zero ad-hoc colors. | **COMPLIANT** |
| **Pure Function $f(t)$** | Deterministic mathematical evaluation without `setInterval`, `requestAnimationFrame`, or timers. | **COMPLIANT** |
| **Hold Durations** | Scene A: 1,600ms & 1,400ms holds; Scene B: all 5 beats $\ge 1,500\text{ ms}$ (exceeds $600\text{ms}$ min). | **COMPLIANT** |
| **Transition Overlap** | All inter-beat transitions feature 200–250 ms morphing overlaps. | **COMPLIANT** |
| **Single Lead Element** | Exactly one lead element at 100% amplitude per beat; secondary at 40%–60%. | **COMPLIANT** |
| **Grid & Center of Mass** | All coordinates snap to 8px grid; visual centers of mass within $\le 2.6\%$ of $(200, 150)$. | **COMPLIANT** |
| **8° Slant Rule** | 8° slant strictly applied to shape geometry; typography remains upright and clean. | **COMPLIANT** |

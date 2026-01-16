# Architecture Documentation - CISO Work Cycle

> **Last verified**: January 2026
> **Version**: 0.5.0

## Overview

CISO Work Cycle is a static web application that visualizes cybersecurity project portfolios on an interactive maturity curve. It's designed for CISOs to communicate security initiatives to executives and board members.

**Key characteristics:**
- **Static-first**: Exports to pure HTML/CSS/JS, deployable to any CDN
- **Single-purpose**: Visualization tool, not a project management system
- **Zero backend**: All data is embedded at build time

---

## Technology Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | Next.js | 14.2.33 | App Router, static export mode |
| UI | React | 18.3.1 | Client components for interactivity |
| Language | TypeScript | 5.3.3 | Strict mode enabled |
| Styling | Tailwind CSS | 3.3.3 | CSS variables for theming |
| Icons | Lucide React | 0.446.0 | BarChart3, Shield, AlertTriangle, Briefcase |
| Testing | Jest | 29.7.0 | jsdom environment |

**Installed but unused**: Radix UI (25+ components), recharts, react-hook-form, zod. These were likely added by a UI scaffolding tool but the application uses custom SVG visualization instead.

---

## Project Structure

```
ciso-work-cycle/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout with Header, Inter font
│   ├── page.tsx                   # Dashboard with 3-column grid
│   └── globals.css                # CSS variables (light/dark themes)
│
├── components/
│   ├── features/
│   │   └── ProgressCurve.tsx      # Core visualization (989 lines)
│   └── layout/
│       ├── Header.tsx             # Sticky navigation bar
│       └── Sidebar.tsx            # Category-grouped project lists
│
├── lib/
│   ├── data.ts                    # Project data (10 projects) + types
│   └── utils.ts                   # cn() helper (clsx + tailwind-merge)
│
├── __tests__/                     # Jest test suites
│   ├── components/features/       # ProgressCurve.test.tsx
│   ├── components/layout/         # Header.test.tsx, Sidebar.test.tsx
│   └── lib/                       # data.test.ts
│
├── scripts/
│   ├── update-data.js             # CSV → TypeScript converter
│   └── add-license-headers.js     # SPDX header automation
│
├── docs/
│   ├── adr/                       # 6 Architecture Decision Records
│   ├── data-management.md         # CSV workflow guide
│   ├── testing-strategy.md        # Testing philosophy
│   └── troubleshooting.md         # Common issues
│
└── Configuration
    ├── next.config.js             # Static export, unoptimized images
    ├── tailwind.config.ts         # Design tokens, dark mode
    ├── jest.config.js             # Coverage thresholds
    └── tsconfig.json              # Path aliases (@/components, @/lib)
```

---

## Core Component: ProgressCurve.tsx

The 989-line visualization component is the heart of the application.

### State Management

The component manages 7 pieces of local state (no global state library):

| State | Type | Purpose |
|-------|------|---------|
| `mounted` | boolean | Hydration guard for SSR |
| `dimensions` | {width, height} | Container size, default 1200×800 |
| `breakpoint` | 'base' \| 'sm' \| 'lg' | Current responsive tier |
| `projectPoints` | Array | Calculated SVG coordinates per project |
| `labelPositions` | Map | Collision-free label placements |
| `hoveredProject` | Project \| null | Currently highlighted project |
| `tooltipPosition` | {x, y} | Tooltip coordinates |

### Responsive Breakpoints

The component uses overlapping ranges with hysteresis to prevent thrashing:

```javascript
const BREAKPOINTS = {
  base: { min: 0, max: 700 },      // Mobile
  sm: { min: 600, max: 1100 },     // Tablet (overlap for stability)
  lg: { min: 1000, max: Infinity } // Desktop (overlap for stability)
};
```

### Label Positioning Algorithm

Labels are positioned using an 8-position priority system with collision detection:

1. Right of marker
2. Left of marker
3. Above-right
4. Above-left
5. Below-right
6. Below-left
7. Directly above
8. Directly below
9. (Fallback: forced placement)

### Performance Optimizations

- `useMemo` for curve path and label position calculations
- ResizeObserver with 200ms debounce
- Minimum 5px width delta before recalculation
- Breakpoint hysteresis (50px threshold) to prevent rapid switching

---

## Data Model

### Project Structure (lib/data.ts)

```typescript
interface Project {
  name: string;                    // Display name
  position: number;                // 0.0-1.0 along the curve
  category: Category;              // One of 4 types
  risk: 'L' | 'M' | 'H';          // Low/Medium/High
  complexity: 'L' | 'M' | 'H';    // Low/Medium/High
  timeline: Timeline;              // One of 5 values
}

type Category =
  | 'Unplanned Work'       // Red (destructive)
  | 'IS Projects'          // Dark gray (primary)
  | 'IT/Business Projects' // Light gray (secondary)
  | 'Business-as-Usual';   // Muted

type Timeline =
  | 'next month'    // ○
  | 'next quarter'  // ●
  | 'next half'     // △
  | 'next year'     // ▲
  | 'on hold';      // ⊗
```

### Current Projects (10 total)

| Position | Name | Category | Risk | Complexity | Timeline |
|----------|------|----------|------|------------|----------|
| 0.15 | Leadership | Unplanned Work | H | L | next month |
| 0.25 | Cyber Transformation | IS Projects | H | H | on hold |
| 0.32 | LOB Support Model | IS Projects | L | L | next half |
| 0.35 | Regulatory Engagement / Assessment | Business-as-Usual | M | H | next half |
| 0.40 | Microsoft 365 | IT/Business Projects | H | H | next year |
| 0.45 | Sector / Government Engagements | Business-as-Usual | M | M | next quarter |
| 0.55 | Cloud Operating Model | Unplanned Work | H | H | next quarter |
| 0.65 | Vulnerability Management | Business-as-Usual | M | M | next quarter |
| 0.75 | New Data Center | IT/Business Projects | H | H | next year |
| 0.85 | Issue Management Program | IT/Business Projects | H | H | next year |

---

## Layout Architecture

### Page Layout (app/page.tsx)

```
┌─────────────────────────────────────────────────────────────┐
│                        Header                                │
├─────────────────────────────────────────────────────────────┤
│  "Track project progress and implementation phases"         │
├──────────┬────────────────────────────────┬─────────────────┤
│  Left    │                                │      Right      │
│ Sidebar  │      ProgressCurve (SVG)       │     Sidebar     │
│  240px   │           (flex-1)             │      240px      │
│          │                                │                 │
│ Unplanned│    [Interactive curve with     │  IT/Business    │
│   Work   │     project markers and        │    Projects     │
│          │     hover tooltips]            │                 │
│    IS    │                                │  Business-as-   │
│ Projects │                                │     Usual       │
└──────────┴────────────────────────────────┴─────────────────┘
```

The grid is responsive:
- **Mobile (< md)**: Single column, curve first
- **Tablet (md)**: Two columns
- **Desktop (lg)**: Three columns with fixed 240px sidebars

### Sidebar Categories

| Left Sidebar | Right Sidebar |
|--------------|---------------|
| Unplanned Work (AlertTriangle icon) | IT/Business Projects (Briefcase icon) |
| IS Projects (Shield icon) | Business-as-Usual (Briefcase icon) |

---

## Design System

### CSS Variables (globals.css)

```css
/* Light Mode */
--background: 0 0% 100%;           /* White */
--foreground: 0 0% 3.9%;           /* Near-black */
--primary: 0 0% 9%;                /* Dark gray */
--secondary: 0 0% 96.1%;           /* Light gray */
--destructive: 0 84.2% 60.2%;      /* Red */
--muted: 0 0% 96.1%;               /* Subtle gray */
--border: 0 0% 89.8%;              /* Border gray */
--radius: 0.5rem;                  /* 8px */

/* Dark Mode (class-based) */
--background: 0 0% 3.9%;           /* Near-black */
--foreground: 0 0% 98%;            /* Near-white */
/* ... inverted values */
```

### Risk/Complexity Badge Colors

| Level | Background | Text |
|-------|------------|------|
| High (H) | `#fee2e2` | `#991b1b` |
| Medium (M) | `#fef3c7` | `#92400e` |
| Low (L) | `#dcfce7` | `#166534` |

---

## Build & Deployment

### Static Export Configuration

```javascript
// next.config.js
const nextConfig = {
  output: 'export',              // Pure static HTML/CSS/JS
  images: { unoptimized: true }, // No Image component optimization
  eslint: { ignoreDuringBuilds: true },
  trailingSlash: true,           // Clean URLs for static hosting
};
```

### NPM Scripts

```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Static export to out/
npm start            # Serve out/ directory
npm run lint         # ESLint
npm test             # Jest tests
npm run test:coverage # With coverage report
npm run update-data  # CSV → TypeScript conversion
```

### Deployment

The `out/` directory can be deployed to:
- Vercel (native Next.js support)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static file server

---

## Testing

### Jest Configuration

```javascript
// Coverage thresholds
coverageThreshold: {
  global: {
    branches: 70, functions: 70, lines: 70, statements: 70
  },
  './components/features/ProgressCurve.tsx': {
    branches: 85, functions: 85, lines: 85, statements: 85
  }
}
```

### Test Suites

| File | Description |
|------|-------------|
| ProgressCurve.test.tsx | Visualization rendering, interactions |
| Header.test.tsx | Navigation component |
| Sidebar.test.tsx | Category grouping, project display |
| data.test.ts | Type validation, data structure |

### Required Mocks (jest.setup.js)

- ResizeObserver
- IntersectionObserver
- window.matchMedia
- SVGPathElement.getTotalLength / getPointAtLength
- HTMLCanvasElement.getContext

---

## Data Update Workflow

1. Edit `project-data-template.csv` with new project data
2. Run `npm run update-data`
3. Script validates:
   - Unique, non-empty project names
   - Position: 0.0-1.0 range
   - Category: One of 4 valid types
   - Risk/Complexity: L, M, or H
   - Timeline: One of 5 valid values
4. Generates new `lib/data.ts` with backup
5. Rebuild and deploy

---

## Security Model

**Zero-backend architecture** minimizes attack surface:

| Concern | Mitigation |
|---------|------------|
| XSS | React automatic escaping |
| Data exposure | No sensitive data in bundle |
| Supply chain | npm audit, SPDX license headers |
| Runtime injection | Static build, no eval() |
| MITM | Deploy with HTTPS |

---

## Code Conventions

### File Headers

All source files include SPDX headers:
```typescript
// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2025 Alex Foley
```

### Client Components

Interactive components declare:
```typescript
'use client';
```

### Path Aliases

```typescript
import { projects } from '@/lib/data';
import { Header } from '@/components/layout/Header';
```

---

## Limitations

- **Label density**: With >15 closely-spaced projects, some label overlap may occur
- **No runtime data**: All projects are embedded at build time
- **Accessibility**: Keyboard navigation and ARIA support are incomplete

---

## Related Documentation

- [Architecture Decision Records](docs/adr/) - 6 ADRs covering key decisions
- [Data Management Guide](docs/data-management.md) - CSV workflow
- [Testing Strategy](docs/testing-strategy.md) - Testing philosophy
- [Troubleshooting](docs/troubleshooting.md) - Common issues
- [SECURITY.md](SECURITY.md) - Vulnerability disclosure
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development workflow

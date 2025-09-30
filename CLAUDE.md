# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Project Architecture

This is a Next.js 13.5 application using the App Router that visualizes cybersecurity project portfolios on an interactive Hype Cycle curve for CISOs.

### Key Components

- **ProgressCurve.tsx**: Core visualization component that renders the interactive Hype Cycle curve with SVG. Contains complex mathematical calculations for curve positioning and responsive design logic.
- **Project Data Model**: All project data is centralized in `lib/data.ts` with TypeScript interfaces defining project structure, timeline markers, and category classifications.

### Data Structure

Projects are categorized into four types:
- Unplanned Work (emergency/reactive)
- IS Projects (information security)
- IT/Business Projects (cross-functional)
- Business-as-Usual (operational)

Each project has:
- Position on curve (0-1 float)
- Risk level (L/M/H)
- Complexity rating (L/M/H)
- Timeline with visual markers (○●△▲⊗)

### Tech Stack

- **Frontend**: Next.js 13.5 + TypeScript + Tailwind CSS
- **UI Library**: Shadcn/UI with Radix UI primitives
- **Visualization**: Custom SVG rendering with responsive mathematics
- **Styling**: Tailwind with 8px spacing grid system

### Code Organization

```
app/                 # Next.js App Router
├── layout.tsx       # Root layout
├── page.tsx         # Main dashboard
└── globals.css      # Global styles

components/
├── features/        # Core business logic
├── layout/          # Layout components
└── ui/             # Reusable UI primitives

lib/
├── data.ts         # Project data and types
└── utils.ts        # Utility functions
```

## Customization

To add projects, edit `lib/data.ts` and add objects to the projects array with required fields: name, position, category, risk, complexity, timeline.

The application uses a design system with Apple-level aesthetics and follows responsive design patterns with mobile-first approach.
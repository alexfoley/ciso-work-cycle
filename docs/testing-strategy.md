# Testing Strategy

## Executive Summary

This document explains the testing approach for the CISO Work Cycle visualization tool. Our testing strategy prioritizes **executive presentation reliability** and **decision-making confidence** over exhaustive code coverage.

## Why We Test

As a tool designed for CISO executive portfolio visualization and board presentations, reliability is paramount. CISOs need to trust that:

1. **Visual accuracy matters** - Project positions on the maturity curve must be mathematically correct
2. **Presentations can't fail** - The tool must work reliably across different display sizes (MacBook Pro, external monitors, presentation screens)
3. **Data integrity is critical** - The CSV workflow that powers project updates must be bulletproof
4. **Interactive features work consistently** - Hovering to see project details must be responsive and accurate

A single visual glitch or incorrect positioning during an executive presentation undermines credibility. Our tests prevent that.

## What We Test

### Core Visualization (ProgressCurve.tsx)
**Coverage: 95%** - The heart of the tool

We test the mathematical accuracy and visual reliability that executives depend on:

- **Curve mathematics**: Projects position correctly along the maturity curve based on their 0-1 position values
- **Responsive behavior**: The visualization adapts properly across MacBook Pro display sizes (13", 14", 16") and external monitors
- **Interactive tooltips**: Hovering a project marker displays accurate details without visual glitches
- **Timeline markers**: The five timeline indicators (○●△▲⊗) render correctly and consistently
- **Grid lines and labels**: Reference lines and axis labels appear correctly for executive understanding

**Why this matters**: During a board presentation, a CISO needs confidence that the curve accurately represents project maturity. Incorrect positioning or broken interactivity undermines the entire narrative.

### Executive Data Workflow (CSV → TypeScript)
**Coverage: 46%** - Core validation functions tested

The tool uses a CSV-based workflow so CISOs can update project data without touching code:

1. CISO updates `project-data-template.csv` with current portfolio state
2. Script validates all data (positions, risk levels, complexity, timelines)
3. Script generates TypeScript data file for the visualization
4. Backup/rollback ensures no data loss on validation failures

**What's tested**: CSV parsing, all validation rules (position 0.0-1.0, categories, risk L/M/H, complexity L/M/H, timelines), TypeScript generation with correct type assertions.

**What's not tested**: File I/O operations, terminal logging, main execution flow (tested manually via `npm run update-data`).

**Why this matters**: A CISO updating quarterly project status cannot afford corrupted data or validation failures. The workflow must be foolproof.

### Layout Components
**Coverage: 100%** - Full validation

Header and sidebar components provide context and navigation:

- **Header**: Consistent branding across all screens
- **Sidebar**: Project categorization (Unplanned Work, IS Projects, IT/Business Projects, Business-as-Usual)

**Why this matters**: Executive understanding depends on clear categorization. Projects must be correctly grouped by type for strategic decision-making.

## Testing Philosophy

### Executive-Critical Focus

We don't aim for 100% coverage. We aim for **executive confidence**.

Our coverage targets:
- **ProgressCurve.tsx**: 85%+ (achieved 95%) ✅
- **Data pipeline**: Focus on validation logic (achieved 46% overall, 100% on core functions) ✅
- **Layout components**: 70%+ (achieved 100%) ✅
- **Global project**: Not a primary target - varies based on utility scripts

**What we don't test exhaustively**:
- File I/O and logging in scripts - Tested manually, low risk
- Edge cases that don't affect executive use cases
- Third-party utilities (Tailwind, Next.js) - Tested by their maintainers

### Real-World Scenarios

Our tests simulate actual executive usage:

- **Board presentation scenario**: Large display, multiple projects, interactive exploration
- **Quarterly update workflow**: CISO updates CSV, validates, regenerates visualization
- **Mobile review**: CISO reviews portfolio on MacBook Pro (13" screen)
- **External monitor**: Presentation on 27"+ displays in conference rooms

## Executive Confidence

**What executives can trust:**

1. ✅ The curve accurately positions projects based on maturity values
2. ✅ Interactive tooltips work reliably across all screen sizes
3. ✅ Responsive design adapts to different presentation contexts
4. ✅ Timeline markers display consistently
5. ✅ Grid lines and labels provide accurate reference points
6. ✅ CSV workflow validates all data before updating visualization
7. ✅ Project categorization displays correctly in sidebars
8. ✅ Header branding is consistent across all screens

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode (for development)
npm run test:watch
```

## Executive Workflow Scripts

**How it works**: CISOs run `npm run update-data` → NPM executes `node scripts/update-data.js` → validates CSV → generates TypeScript.

**Why no shebang**: Scripts are invoked via NPM, not run directly as executables. Removing `#!/usr/bin/env node` allows Jest to test the actual files executives use, not workarounds.

**What's tested**: CSV parsing, all validation rules, TypeScript generation. What's not: File I/O, logging (tested manually).

## Conclusion

Testing for an executive visualization tool isn't about achieving arbitrary coverage percentages. It's about ensuring that when a CISO presents to their board, demonstrates portfolio maturity to stakeholders, or makes strategic decisions based on this visualization, **the tool works flawlessly**.

Our 95% coverage of the core visualization component reflects this priority: we test what matters most for executive confidence and presentation reliability.

---

## Related Documentation

- **[Contributing Guide](../CONTRIBUTING.md#testing-requirements)** - Testing requirements for contributors
- **[Troubleshooting Guide](troubleshooting.md)** - Solutions for test failures and debugging
- **[Architecture Documentation](../ARCHITECTURE.md)** - Technical architecture and design decisions
- **[Data Management Guide](data-management.md)** - CSV workflow that testing validates

# ADR-002: Visualization Approach Selection

**Status:** Accepted

**Date:** 2025-09-30

**Decision Makers:** CISO, UX/Visualization Team, Development Team

## Context

The CISO Work Cycle requires sophisticated data visualization to represent project portfolios on a custom maturity curve. The visualization must support:

1. **Mathematical Precision**: Accurate Bezier curve rendering with project positioning
2. **Executive Quality**: Print-ready graphics suitable for board presentations
3. **Interactivity**: Hover states, tooltips, and responsive design
4. **Performance**: Smooth rendering of 10-100 projects across device types
5. **Accessibility**: Screen reader support and keyboard navigation

The curve represents project progression through stages:
- **Novel**: Initial exploration phase
- **Top of Mind**: Peak visibility and expectations
- **"Evolving"**: Refinement and reality adjustment
- **Momentum**: Gaining practical traction
- **Maturity**: Established and productive

**Technology Options Evaluated:**

| Approach | Rendering | Interactivity | Print Quality | Performance | Accessibility |
|----------|-----------|---------------|---------------|-------------|---------------|
| **SVG** | Vector | Native DOM | Excellent | Good | Excellent |
| **Canvas** | Raster | Manual | Poor | Excellent | Poor |
| **WebGL** | GPU | Complex | Poor | Outstanding | Complex |
| **Chart Libraries** | Varies | Limited | Varies | Good | Varies |

## Decision

**Selected: Native SVG with React Integration**

Implement custom SVG rendering using:
- **Mathematical Foundation**: Parametric Bezier curves with precise control points
- **React Integration**: JSX-based SVG elements for component reusability
- **Responsive Design**: Viewport-based coordinate transformation
- **Interactive Layer**: Native DOM events for hover and selection states

**Rejected Alternatives:**

- **Canvas**: Eliminated due to poor print quality and accessibility challenges
- **WebGL**: Overkill for current requirements, adds unnecessary complexity
- **Chart Libraries** (D3, Chart.js, Recharts): Too opinionated, limited customization for our unique progress curve visualization

## Consequences

### Positive

- **Print Excellence**: Vector graphics scale infinitely for 4K displays and PDF export
- **Accessibility**: Native DOM structure supports screen readers and keyboard navigation
- **Developer Experience**: Familiar HTML/CSS paradigms with React component structure
- **Performance**: Efficient for moderate data sizes (10-100 projects)
- **SEO/Crawling**: Search engines and tools can analyze SVG content
- **Styling Integration**: CSS and Tailwind classes work seamlessly with SVG elements
- **Custom Design**: Full control over our unique progress curve visualization

### Negative

- **Complexity**: Requires custom mathematical implementation for curve generation
- **Performance Ceiling**: May require optimization for very large datasets (1000+ projects)
- **Cross-browser**: SVG rendering differences between browsers (minimal impact)

### Neutral

- **Bundle Size**: No additional visualization library dependencies
- **Learning Curve**: Team familiar with SVG from web development experience

## Security Impact

- **Threat Model Changes**:
  - ✅ No external visualization library dependencies reduce supply chain risk
  - ✅ Native browser SVG rendering eliminates third-party security concerns
  - ✅ Content Security Policy easily applied to inline SVG

- **Attack Surface**:
  - Minimal: SVG content generated from trusted TypeScript data
  - No dynamic SVG content loading from external sources
  - XSS protection through React's built-in sanitization

- **Compliance**:
  - WCAG 2.1 AA compliance through proper ARIA labeling
  - Screen reader support via SVG `<title>` and `<desc>` elements

## Implementation Notes

- **Timeline**: Core curve rendering implemented Day 2, interactive features Day 3
- **Migration Strategy**: If performance becomes limiting, gradual migration to Canvas for curve rendering while maintaining SVG for UI elements
- **Rollback Plan**: Chart library integration possible with D3.js or similar if custom implementation proves insufficient
- **Success Metrics**:
  - Smooth 60fps interactions on desktop
  - Print quality at 300+ DPI
  - Screen reader compatibility verified

## Mathematical Implementation

```typescript
// Custom Progress Curve Definition
const curvePath = `
  M ${start.x},${start.y}  // Novel phase start
  C ${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${peak.x},${peak.y}  // Rise to Top of Mind
  C ${cp3.x},${cp3.y} ${cp4.x},${cp4.y} ${trough.x},${trough.y}  // Through "Evolving"
  C ${cp5.x},${cp5.y} ${cp6.x},${cp6.y} ${plateau.x},${plateau.y}  // Momentum to Maturity
`;

// Project Positioning (0.0 to 1.0 along curve)
const point = pathElement.getPointAtLength(pathLength * project.position);
```

## References

- [SVG Accessibility Guidelines](https://www.w3.org/WAI/tutorials/images/complex/)
- [Bezier Curve Mathematics](https://javascript.info/bezier-curve)
- [React SVG Best Practices](https://react.dev/learn/adding-interactivity)
- Related: [ADR-001: Technology Stack Selection](./ADR-001-technology-stack-selection.md)

---

*This ADR follows the format established by Michael Nygard in "Documenting Architecture Decisions"*
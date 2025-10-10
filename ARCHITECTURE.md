# Architecture Documentation - CISO Work Cycle

## Executive Summary

The CISO Work Cycle is an executive-grade visualization platform that transforms complex cybersecurity project portfolios into intuitive, board-ready presentations using an interactive maturity curve methodology. Built for Chief Information Security Officers to communicate security initiatives, resource allocation, and strategic priorities to C-suite executives and board members.

## C4 Model Architecture

### Level 1: System Context

The highest level view showing how the CISO Work Cycle fits within the organizational ecosystem.

```mermaid
graph TB
    subgraph "Organization"
        CISO["CISO<br/>(Primary User)"]
        Exec["C-Suite Executives<br/>(Viewers)"]
        Board["Board Members<br/>(Viewers)"]
        SecTeam["Security Team<br/>(Data Contributors)"]
    end

    System["CISO Work Cycle<br/>【Software System】<br/>Interactive project visualization<br/>platform for security portfolios"]

    subgraph "External Systems"
        Linear["Linear<br/>【External System】<br/>Project management"]
        GitHub["GitHub<br/>【External System】<br/>Version control"]
        Slack["Slack/Teams<br/>【External System】<br/>Notifications"]
    end

    CISO -->|"Manages projects<br/>Configures data"| System
    Exec -->|"Views dashboards<br/>Reviews progress"| System
    Board -->|"Reviews presentations<br/>Tracks KPIs"| System
    SecTeam -->|"Updates project status"| System

    System -->|"Syncs issues"| Linear
    System -->|"Stores code"| GitHub
    System -->|"Sends updates"| Slack
```

**Key Stakeholders:**
- **CISO**: Primary user who configures projects and presents to executives
- **C-Suite/Board**: Consume visualizations for decision-making
- **Security Team**: Provide project updates and status

### Level 2: Container Diagram

Shows the high-level technical building blocks and their interactions.

```mermaid
graph TB
    subgraph "Client Browser"
        SPA["Single Page Application<br/>【Container: Next.js 14.2】<br/>React 18.3, TypeScript 5.3<br/>Interactive visualization UI"]
    end

    subgraph "Build System"
        Build["Static Site Generator<br/>【Container: Next.js SSG】<br/>Pre-renders pages at build time"]
    end

    subgraph "Data Layer"
        DataFile["Project Data<br/>【Container: TypeScript】<br/>Type-safe project definitions<br/>lib/data.ts"]
        CSV["CSV Import<br/>【Container: Node.js Script】<br/>Executive-friendly data entry"]
    end

    subgraph "Deployment"
        CDN["CDN/Static Hosting<br/>【Container: Vercel/Netlify】<br/>Global edge distribution"]
    end

    User[["User Browser"]]

    User -->|"HTTPS"| CDN
    CDN -->|"Serves"| SPA
    SPA -->|"Reads"| DataFile
    CSV -->|"Generates"| DataFile
    Build -->|"Produces"| SPA
    Build -->|"Bundles"| DataFile
```

**Technology Choices:**
- **Next.js 14.2.33**: Enterprise-grade React framework with security patches
- **TypeScript 5.3.3**: Type safety for mathematical calculations
- **Tailwind CSS**: Rapid, consistent styling system
- **Static Generation**: No backend required, maximum security

### Level 3: Component Diagram

Internal structure of the Single Page Application.

```mermaid
graph TB
    subgraph "Presentation Layer"
        Page["Main Dashboard<br/>【Component: page.tsx】<br/>Entry point and layout"]
        Header["Header<br/>【Component: Header.tsx】<br/>Navigation and branding"]
        Sidebar["Category Sidebar<br/>【Component: Sidebar.tsx】<br/>Project categorization"]
    end

    subgraph "Visualization Core"
        Curve["Progress Curve<br/>【Component: ProgressCurve.tsx】<br/>SVG curve rendering<br/>Mathematical positioning"]
        Tooltip["Interactive Tooltips<br/>【Sub-component】<br/>Project detail overlays"]
        Legend["Timeline Legend<br/>【Sub-component】<br/>Visual timeline markers"]
    end

    subgraph "Data Management"
        ProjectData["Project Data Model<br/>【Module: lib/data.ts】<br/>Type definitions<br/>Project configurations"]
        Utils["Utilities<br/>【Module: lib/utils.ts】<br/>Helper functions"]
    end

    subgraph "Design System"
        Styles["Global Styles<br/>【Module: globals.css】<br/>Design tokens<br/>CSS variables<br/>Tailwind utilities"]
    end

    Page --> Header
    Page --> Sidebar
    Page --> Curve
    Curve --> Tooltip
    Curve --> Legend
    Curve --> ProjectData
    Curve --> Styles
    Header --> Styles
    Sidebar --> Styles
    ProjectData --> Utils
```

### Level 4: Deployment Diagram

Shows how the system is deployed to production infrastructure.

```mermaid
graph TB
    subgraph "Developer Environment"
        Dev["Developer Machine<br/>Node.js 20.x<br/>npm 11.x"]
        Local["Local Dev Server<br/>http://localhost:3000"]
    end

    subgraph "CI/CD Pipeline"
        GH["GitHub Actions<br/>Build & Test"]
        Security["Security Scanning<br/>npm audit<br/>Dependency checks"]
    end

    subgraph "Production Environment"
        Edge["Global Edge Network<br/>【CDN】"]
        Static["Static Assets<br/>HTML, JS, CSS"]

        subgraph "Geographic Distribution"
            US["US Edges"]
            EU["EU Edges"]
            APAC["APAC Edges"]
        end
    end

    subgraph "Monitoring"
        Analytics["Analytics<br/>Performance metrics"]
        Logs["Error Tracking<br/>Console monitoring"]
    end

    Dev -->|"git push"| GH
    GH -->|"Validates"| Security
    Security -->|"Deploys"| Edge
    Edge --> Static
    Static --> US
    Static --> EU
    Static --> APAC
    Edge --> Analytics
    Edge --> Logs
```

## Design System Architecture

### Visual Hierarchy

```
Executive Presentation Layer
├── Primary Focus: Progress Curve
│   ├── Mathematical Bezier curves
│   ├── Responsive SVG rendering
│   └── 60fps animation targets
├── Secondary: Project Markers
│   ├── Timeline symbols (○●△▲⊗)
│   ├── Risk/Complexity indicators
│   └── Hover state interactions
└── Supporting: Navigation & Context
    ├── Category sidebars
    ├── Legend system
    └── Tooltip overlays
```

### Responsive Design Architecture

| Breakpoint | Target Device | Optimizations |
|------------|--------------|---------------|
| Base (<700px) | Mobile/Tablet | Simplified curve, larger touch targets |
| Small (700-1100px) | Laptop | Standard curve, balanced information |
| Large (>1100px) | Desktop/Presentation | Full detail, executive display mode |

### SVG Mathematics & Positioning

The core visualization uses parametric Bezier curves with precise mathematical positioning:

```typescript
// Curve Definition (Simplified)
path = `M ${start}
        C ${control1} ${control2} ${point1}
        C ${control3} ${control4} ${point2}
        ...`

// Project Positioning
position: 0.0 - 1.0 along curve path
point = path.getPointAtLength(pathLength * position)
```

**Key Algorithms:**
- **Curve Generation**: Cubic Bezier with 5 control segments
- **Project Placement**: Path length interpolation
- **Responsive Scaling**: Viewport-based coordinate transformation
- **Collision Detection**: Spatial hashing for tooltip positioning

## Executive Requirements Architecture

### Board Presentation Mode

**Performance Requirements:**
- Load time: <2 seconds on corporate networks
- Render time: <100ms for interactions
- Resolution support: 4K displays (3840×2160)
- Print quality: Vector graphics for PDF export

**Accessibility Status:**
- ✅ Color contrast ratios: 4.5:1 minimum (verified for text and badges)
- ✅ Responsive design: Works across screen sizes
- ⚠️ Keyboard navigation: Todo
- ⚠️ Screen reader support: Todo
- ⚠️ ARIA labels: Todo

**Note**: We're actively working toward full WCAG 2.1 AA compliance. Current visual accessibility is good, but functional accessibility for screen readers and keyboard-only users needs enhancement.

### Data Security Architecture

```mermaid
graph LR
    subgraph "Security Boundaries"
        Client["Client-Only Processing<br/>No backend API calls<br/>No data transmission"]
        Static["Static Data Model<br/>Compile-time inclusion<br/>No runtime fetching"]
        Local["Local Storage<br/>Optional preferences<br/>No sensitive data"]
    end

    subgraph "Threat Mitigation"
        CSP["Content Security Policy<br/>Strict source control"]
        SRI["Subresource Integrity<br/>Asset verification"]
        Deps["Dependency Security<br/>0 vulnerabilities<br/>Automated scanning"]
    end

    Client --> CSP
    Static --> SRI
    Local --> Deps
```

## Technology Decision Rationale

### Core Framework: Next.js 14.2.33

**Selected Over:**
- Angular: Too heavy for visualization-focused app
- Vue: Smaller ecosystem for enterprise components
- Vanilla React: Lacks built-in optimizations

**Rationale:**
- Production-proven in Fortune 500 deployments
- Built-in security headers and CSP support
- Static generation eliminates attack surface
- Automatic code splitting for performance

### Visualization: Native SVG vs Canvas vs WebGL

**Decision: Native SVG**

| Criteria | SVG ✓ | Canvas | WebGL |
|----------|-------|---------|--------|
| Print Quality | Vector | Raster | Raster |
| Accessibility | Native | Manual | Complex |
| Performance (50 items) | Excellent | Good | Overkill |
| Developer Experience | Familiar | Moderate | Complex |
| SEO/Crawlability | Yes | No | No |

### State Management: Local vs Redux vs Zustand

**Decision: React Local State**
- Application is primarily read-only
- Limited state complexity (hover, viewport)
- No need for time-travel debugging
- Reduces bundle size by ~30KB

## Scalability Considerations

### Current Limits
- **Projects**: Optimized for 10-100 items
- **Categories**: 4-10 recommended
- **Viewport**: 320px to 4K displays

### Growth Path

```mermaid
graph LR
    Current["Current State<br/>Static data<br/>10-100 projects"]
    Next["Phase 2<br/>Dynamic data<br/>100-500 projects"]
    Future["Future State<br/>Real-time sync<br/>1000+ projects"]

    Current -->|"CSV import<br/>enhancement"| Next
    Next -->|"API integration<br/>virtualization"| Future
```

**Phase 2 Enhancements:**
- Dynamic data loading from API
- Virtual scrolling for large datasets
- Progressive rendering for performance

**Future Considerations:**
- WebSocket real-time updates
- Multi-user collaboration
- Historical timeline playback
- AI-powered insights

## Security Architecture

### Dependency Management

```yaml
Strategy: Conservative Updates
- Security patches: Immediate (0-day response)
- Minor versions: Quarterly review
- Major versions: Annual planning
- Breaking changes: Staged migration
```

### Vulnerability Response

1. **Detection**: Automated npm audit in CI/CD
2. **Assessment**: CVSS score evaluation
3. **Remediation**: Patch → Test → Deploy
4. **Validation**: Post-deployment verification

### Client-Side Threat Model

| Threat | Mitigation |
|--------|------------|
| XSS | React sanitization, CSP headers |
| Supply chain | npm audit, SRI, lockfile |
| Data exposure | No sensitive data in client |
| MITM | HTTPS only, HSTS headers |
| Code injection | Static build, no eval() |

## Future Architecture Vision

### Enhanced Executive Features
- **Export System**: PowerPoint, PDF, Keynote integration
- **Annotation Layer**: Executive comments on projects
- **Scenario Modeling**: What-if analysis for resource allocation
- **KPI Dashboard**: Automated metric calculation

### Technical Evolution
- **Micro-frontends**: Modular feature deployment
- **Edge Functions**: Personalization at edge
- **AI Integration**: Natural language project updates
- **Mobile App**: Native iOS/Android for on-the-go access

### Integration Roadmap

```mermaid
timeline
    title Integration Architecture Evolution

    2025 Q4 : Current State
            : Static visualization
            : Manual data updates

    2026 Q1 : API Integration
            : Linear sync
            : Jira connector
            : ServiceNow bridge

    2026 Q2 : Intelligence Layer
            : Predictive analytics
            : Risk scoring
            : Automated insights

    2026 Q3 : Enterprise Platform
            : SSO/SAML
            : Role-based access
            : Audit logging
```

## Conclusion

The CISO Work Cycle architecture prioritizes:
1. **Executive Experience**: Board-ready visualizations
2. **Security**: Zero-vulnerability baseline
3. **Performance**: Instant interactions
4. **Maintainability**: Simple, documented patterns
5. **Evolution**: Clear path to enterprise features

This architecture supports both immediate executive presentation needs and long-term evolution into a comprehensive security portfolio management platform.

---

## Related Documentation

- **[Architecture Decision Records](docs/adr/)** - Detailed decision documentation (ADR-001 through ADR-005)
- **[Security Policy](SECURITY.md)** - Vulnerability disclosure and security practices
- **[Contributing Guide](CONTRIBUTING.md)** - Development standards and workflow
- **[Testing Strategy](docs/testing-strategy.md)** - Testing philosophy and coverage requirements
- **[Troubleshooting Guide](docs/troubleshooting.md)** - Common issues and solutions

---

*Architecture documentation following C4 Model by Simon Brown*
*Last Updated: September 2025*
*Next Review: Q1 2026*
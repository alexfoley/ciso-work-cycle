# CISO Work Cycle

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)

A sophisticated project management and visualization platform designed specifically for Chief Information Security Officers (CISOs) to track, analyze, and communicate the progress of cybersecurity initiatives across their organization.

## 📚 Table of Contents

- [Overview](#-overview)
- [Key Capabilities](#-key-capabilities)
- [Quick Links](#-quick-links)
- [Getting Started](#-getting-started)
- [Technical Architecture](#-technical-architecture)
- [Project Structure](#-project-structure)
- [Data Management](#-data-management)
- [Use Cases](#-use-cases)
- [Troubleshooting](#-troubleshooting)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Security](#-security)
- [License](#-license)

## 🎯 Overview

The CISO Work Cycle transforms complex project portfolios into intuitive visual narratives, enabling security leaders to effectively communicate project status, resource allocation, and strategic priorities to stakeholders at all levels. Built using a custom maturity curve methodology, this platform provides a unique perspective on cybersecurity project maturity and organizational readiness.

## ✨ Key Capabilities

### 📊 **Visual Project Intelligence**
- **Interactive Progress Curve Visualization**: Projects are plotted along a sophisticated curve representing the journey from initial concept through peak expectations to productive implementation
- **Real-time Progress Tracking**: Dynamic positioning shows where each initiative stands in its lifecycle
- **Risk & Complexity Assessment**: Color-coded indicators provide instant insight into project challenges and resource requirements

### 🎯 **Strategic Portfolio Management**
- **Multi-Category Organization**: Projects are intelligently grouped across four key areas:
  - **Unplanned Work**: Emergency responses and reactive initiatives
  - **IS Projects**: Core information security implementations
  - **IT/Business Projects**: Cross-functional technology initiatives
  - **Business-as-Usual**: Ongoing operational activities
- **Timeline Visualization**: Clear symbols indicate project timelines (next month, quarter, half, year, or on hold)
- **Resource Planning**: Risk and complexity ratings help prioritize resource allocation

### 💼 **Executive Communication**
- **Stakeholder-Ready Dashboards**: Clean, professional interface suitable for board presentations
- **Progress Narratives**: Visual storytelling that translates technical complexity into business impact
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

### 🔍 **Interactive Analysis**
- **Detailed Project Insights**: Hover interactions reveal comprehensive project details
- **Contextual Information**: Instant access to risk assessments, complexity ratings, and timeline data
- **Adaptive Layout**: Interface optimizes for different screen sizes and use cases

## 🔗 Quick Links

### Documentation
- **[Architecture Documentation](ARCHITECTURE.md)** - C4 model architecture with diagrams
- **[Contributing Guide](CONTRIBUTING.md)** - Development workflow and code standards
- **[Executive Data Management Guide](docs/data-management.md)** - CSV-based workflow for non-technical users
- **[Testing Strategy](docs/testing-strategy.md)** - Executive-focused testing approach
- **[Troubleshooting Guide](docs/troubleshooting.md)** - Common issues and solutions
- **[Security Policy](SECURITY.md)** - Vulnerability disclosure and security practices
- **[Architecture Decision Records](docs/adr/)** - Technical decision documentation

### Key Features
- **CSV Data Updates**: Update project data without touching code
- **95% Test Coverage**: Reliable, battle-tested visualization
- **WCAG Compliance**: Accessible design for all users
- **Zero Dependencies**: No backend required, static deployment

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Minimum Version | Check Command | Download Link |
|-------------|----------------|---------------|---------------|
| **Node.js** | 18.0.0+ | `node --version` | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.0.0+ | `npm --version` | Included with Node.js |
| **Git** | 2.0.0+ | `git --version` | [git-scm.com](https://git-scm.com/) |

**Recommended:**
- macOS 12+ (optimized for Mac executive users)
- 8GB RAM minimum
- Modern browser (Safari 15+, Chrome 100+, Firefox 100+)

### Installation

```bash
# Clone the repository
git clone https://github.com/alexfoley/ciso-work-cycle.git
cd ciso-work-cycle

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application in action.

### Quick Start for Executives

**Update project data without coding:**

1. Edit `project-data-template.csv` in Excel or Google Sheets
2. Run `npm run update-data` to validate and generate visualization data
3. Run `npm run dev` to view updated visualization

See the [Executive Data Management Guide](docs/data-management.md) for detailed instructions.

### Production Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to static hosting (Vercel, Netlify, etc.)
npm run build
# Upload .next/static and out/ directories
```

## 🏗️ Technical Architecture

### **Modern Web Stack**
- **Next.js 14.2.33**: React-based framework with App Router and security patches
- **TypeScript 5.3.3**: Full type safety ensuring robust, maintainable code
- **Tailwind CSS 3.4**: Utility-first styling for consistent, responsive design
- **Shadcn/UI**: Premium component library for professional aesthetics

### **Advanced Visualization**
- **Custom SVG Engine**: Hand-crafted curve mathematics for precise project positioning
- **Responsive Scaling**: Dynamic sizing and positioning across all device types
- **Performance Optimized**: Efficient rendering with minimal computational overhead
- **Accessibility Compliant**: WCAG 2.1 AA guidelines adherence for inclusive design

### **Data Architecture**
- **Type-Safe Data Models**: Strongly typed project definitions prevent runtime errors
- **CSV-Based Updates**: Executive-friendly data management without code editing
- **Flexible Schema**: Easy addition of new project categories and attributes
- **Scalable Structure**: Architecture supports growth from dozens to hundreds of projects

**For detailed architecture information**, see [ARCHITECTURE.md](ARCHITECTURE.md) which includes:
- C4 Model diagrams (Context, Container, Component, Deployment)
- Technology decision rationale
- Security architecture
- Scalability considerations

## 📁 Project Structure

```
├── app/                       # Next.js App Router pages
│   ├── globals.css            # Global styles and CSS variables
│   ├── layout.tsx             # Root layout component
│   └── page.tsx               # Main dashboard page
├── components/
│   ├── features/              # Core business logic components
│   │   └── ProgressCurve.tsx  # Main visualization component (95% tested)
│   ├── layout/                # Layout components
│   │   ├── Header.tsx         # Application header (100% tested)
│   │   └── Sidebar.tsx        # Project category sidebars (100% tested)
│   └── ui/                    # Shadcn/UI component library
├── docs/
│   ├── adr/                   # Architecture Decision Records
│   ├── data-management.md     # Executive data update guide
│   └── TESTING-STRATEGY.md    # Testing philosophy and approach
├── hooks/                     # Custom React hooks
├── lib/
│   ├── data.ts                # Project data and type definitions
│   └── utils.ts               # Utility functions and helpers
├── scripts/
│   └── update-data.js         # CSV-to-TypeScript data generator
├── __tests__/                 # Comprehensive test suite
├── ARCHITECTURE.md            # C4 model architecture documentation
├── CLAUDE.md                  # AI assistant guidance
├── LICENSE                    # AGPL-3.0 license
├── README.md                  # This file
└── SECURITY.md                # Security policy and vulnerability reporting
```

## 📊 Data Management

### Project Data Model

```typescript
interface Project {
  name: string;           // Project identifier
  position: number;       // Position on curve (0-1)
  category: string;       // Project category
  risk: 'L' | 'M' | 'H';  // Risk assessment
  complexity: 'L' | 'M' | 'H'; // Complexity rating
  timeline: Timeline;     // Expected completion
}
```

### Timeline Indicators
- `○` Next Month - Immediate priorities
- `●` Next Quarter - Short-term goals
- `△` Next Half - Medium-term planning
- `▲` Next Year - Long-term initiatives
- `⊗` On Hold - Paused projects

### Updating Project Data

**For executives and non-technical users:**

1. Open `project-data-template.csv` in Excel
2. Add/update project rows following the template format
3. Run `npm run update-data` to validate and convert to TypeScript
4. Review your changes with `npm run dev`

**For developers:**

Directly edit `lib/data.ts`:

```typescript
{
  name: 'Zero Trust Implementation',
  position: 0.3,  // 0 = start of curve, 1 = end
  category: 'IS Projects',
  risk: 'H',
  complexity: 'H',
  timeline: 'next quarter'
}
```

📖 **Detailed Guide**: See [docs/data-management.md](docs/data-management.md) for complete instructions.

## 🎯 Use Cases

### **For CISOs**
- **Board Presentations**: Professional visualizations for executive reporting
- **Resource Planning**: Clear view of project complexity and resource needs
- **Strategic Communication**: Translate technical initiatives into business language
- **Portfolio Optimization**: Identify bottlenecks and rebalance workloads

### **For Security Teams**
- **Project Tracking**: Visual progress monitoring across all initiatives
- **Workload Management**: Clear categorization of planned vs. unplanned work
- **Timeline Planning**: Visual timeline management and deadline tracking
- **Risk Assessment**: Integrated risk and complexity evaluation

### **For Stakeholders**
- **Progress Visibility**: Real-time insight into security initiative status
- **Investment Justification**: Clear ROI and progress demonstration
- **Resource Understanding**: Transparent view of security team workload
- **Strategic Alignment**: Connection between security projects and business goals

## 🔧 Troubleshooting

Encountering issues? Check our comprehensive [Troubleshooting Guide](docs/troubleshooting.md) for detailed solutions.

### Quick Fixes

**Port 3000 in use:**
```bash
lsof -ti:3000 | xargs kill -9  # Kill process on port 3000
npm run dev -- -p 3001          # Or use different port
```

**CSV validation errors:**
- Position: Use decimals (0.3) not percentages (30%)
- Category: Use exact names: "IS Projects", "Unplanned Work", etc.
- See [Data Management Guide](docs/data-management.md#troubleshooting-common-issues)

**Build failures:**
```bash
rm -rf .next node_modules  # Clear caches
npm install                # Reinstall dependencies
npm run build              # Rebuild
```

📖 **Complete Guide**: [docs/troubleshooting.md](docs/troubleshooting.md) covers 30+ common issues with step-by-step solutions.

### Getting Help

1. **Documentation**: [ARCHITECTURE.md](ARCHITECTURE.md), [CONTRIBUTING.md](CONTRIBUTING.md), [docs/](docs/)
2. **Search Issues**: [GitHub Issues](https://github.com/alexfoley/ciso-work-cycle/issues)
3. **Report Bugs**: Use [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
4. **Security Issues**: See [SECURITY.md](SECURITY.md) (DO NOT create public issues)

## 🧪 Testing

This project maintains high testing standards to ensure executive presentation reliability:

- **ProgressCurve**: 95% coverage (26 test cases)
- **Header/Sidebar**: 100% coverage (39 test cases)
- **CSV Workflow**: 100% core function coverage (38 test cases)

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode (for development)
npm run test:watch
```

### Testing Philosophy

We focus on **executive confidence over arbitrary coverage metrics**. Tests validate:
- Visual accuracy and curve mathematics
- CSV workflow reliability for non-technical users
- Responsive behavior across presentation displays
- Interactive features (tooltips, hover states)

📖 **Full Testing Strategy**: See [docs/testing-strategy.md](docs/testing-strategy.md)

## 🤝 Contributing

We welcome contributions from the security community! See our [Contributing Guide](CONTRIBUTING.md) for complete details.

### Quick Start

1. **Fork** the repository
2. **Clone** and set up: `npm install`
3. **Branch**: `git checkout -b feature/amazing-feature`
4. **Develop** following [code standards](CONTRIBUTING.md#coding-standards)
5. **Test**: `npm test` (85%+ coverage required)
6. **Commit**: Use [Conventional Commits](CONTRIBUTING.md#commit-message-guidelines)
7. **Push** and create a [Pull Request](CONTRIBUTING.md#pull-request-process)

### Code Standards

- **TypeScript**: Strict typing, no `any` types
- **Testing**: 85%+ coverage for core components
- **Formatting**: Follow ESLint rules (`npm run lint`)
- **Documentation**: Update relevant docs
- **License Headers**: Include SPDX identifiers in new files

📖 **Full Guide**: [CONTRIBUTING.md](CONTRIBUTING.md) covers development setup, testing requirements, PR process, and more.

### Issue Templates

- **Bug Reports**: [.github/ISSUE_TEMPLATE/bug_report.md](.github/ISSUE_TEMPLATE/bug_report.md)
- **Feature Requests**: [.github/ISSUE_TEMPLATE/feature_request.md](.github/ISSUE_TEMPLATE/feature_request.md)
- **Pull Requests**: [.github/pull_request_template.md](.github/pull_request_template.md)

## 🔒 Security

Security is paramount for a CISO tool. We take security seriously:

- **Zero-Vulnerability Baseline**: Dependencies audited regularly with `npm audit`
- **AGPL-3.0 License**: Source code transparency required (see [LICENSING.md](LICENSING.md))
- **Third-Party Attributions**: All dependencies documented in [NOTICE](NOTICE)
- **Static Architecture**: No backend, reduced attack surface
- **WCAG 2.1 AA Compliant**: Accessible to all users

### Reporting Vulnerabilities

**DO NOT** open public issues for security vulnerabilities.

Instead, please report security issues by following our [Security Policy](SECURITY.md):

1. Email: `security@forna.do` (or create a private security advisory on GitHub)
2. Include detailed description and reproduction steps
3. We'll acknowledge within 48 hours
4. We'll work with you on remediation
5. Public disclosure after fix is deployed

See [SECURITY.md](SECURITY.md) for complete vulnerability disclosure policy.

## 🔮 Future Enhancements

- **Data Integration**: Connect to project management tools (Jira, Linear, Asana)
- **Historical Tracking**: Timeline view of project progression over time
- **Advanced Analytics**: Trend analysis and predictive modeling
- **Collaboration Features**: Team comments and status updates
- **Export Capabilities**: PDF reports and presentation-ready exports
- **Custom Metrics**: Configurable KPIs and success measurements
- **CI/CD Integration**: Automated testing and deployment pipelines

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0** (AGPL-3.0).

**What this means:**
- ✅ Free to use, modify, and distribute
- ✅ Source code must remain open
- ✅ Network use requires source code availability
- ✅ Modifications must use same license

See the [LICENSE](LICENSE) file for full legal text or [LICENSING.md](LICENSING.md) for plain-language explanation.

**Why AGPL-3.0?**
- Ensures source code transparency for security tools
- Protects community contributions
- Requires network service providers to share improvements
- Aligns with open-source security principles

**Need commercial licensing?** Contact licensing@forna.do - See [LICENSING.md](LICENSING.md) for details.

---

**Built with ❤️ for security leaders who need to communicate complex technical initiatives in clear, compelling ways.**

**Questions?** Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details or [docs/data-management.md](docs/data-management.md) for usage guides.

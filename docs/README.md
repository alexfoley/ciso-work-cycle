# Documentation Index

Comprehensive documentation for the CISO Work Cycle platform.

## For Executives and End Users

### Getting Started
- **[README](../README.md)** - Project overview, quick start, and key features
- **[Data Management Guide](data-management.md)** - CSV-based workflow for updating project data (no code required)

### Operational
- **[Troubleshooting Guide](troubleshooting.md)** - Solutions to common issues (30+ scenarios covered)
- **[Security Policy](../SECURITY.md)** - Vulnerability disclosure and security practices

## For Developers and Contributors

### Development
- **[Contributing Guide](../CONTRIBUTING.md)** - Development workflow, code standards, and PR process
- **[Testing Strategy](testing-strategy.md)** - Testing philosophy and coverage requirements
- **[Troubleshooting Guide](troubleshooting.md)** - Development environment and debugging

### Architecture and Design
- **[Architecture Documentation](../ARCHITECTURE.md)** - C4 model architecture with diagrams
- **[Architecture Decision Records](adr/)** - Technical decisions and rationale

## Architecture Decision Records (ADRs)

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [ADR-001](adr/ADR-001-technology-stack-selection.md) | Technology Stack Selection | Accepted | 2025-09-30 |
| [ADR-002](adr/ADR-002-visualization-approach.md) | Visualization Approach Selection | Accepted | 2025-09-30 |
| [ADR-003](adr/ADR-003-data-management-strategy.md) | Data Management Strategy | Accepted | 2025-09-30 |
| [ADR-004](adr/ADR-004-nextjs-security-upgrade.md) | Next.js Security Upgrade Decision | Accepted | 2025-09-30 |
| [ADR-005](adr/ADR-005-design-system-architecture.md) | Design System Architecture | Accepted | 2025-09-30 |

See [adr/README.md](adr/README.md) for ADR writing guidelines.

## GitHub Templates

### Issue Templates
- **[Bug Report](.github/ISSUE_TEMPLATE/bug_report.md)** - Report bugs or unexpected behavior
- **[Feature Request](.github/ISSUE_TEMPLATE/feature_request.md)** - Suggest new features or enhancements

### Pull Requests
- **[Pull Request Template](.github/pull_request_template.md)** - Template for submitting pull requests

## Documentation Structure

```
docs/
├── README.md                          # This file - documentation index
├── data-management.md                 # Executive-friendly CSV workflow guide
├── testing-strategy.md                # Testing philosophy and approach
├── troubleshooting.md                 # Comprehensive troubleshooting guide
└── adr/                               # Architecture Decision Records
    ├── README.md                      # ADR index and writing guidelines
    ├── template.md                    # ADR template for new decisions
    ├── ADR-001-technology-stack-selection.md
    ├── ADR-002-visualization-approach.md
    ├── ADR-003-data-management-strategy.md
    ├── ADR-004-nextjs-security-upgrade.md
    └── ADR-005-design-system-architecture.md
```

## Documentation Principles

This documentation follows enterprise best practices:

- **Audience-focused**: Separate guides for executives vs developers
- **Cross-referenced**: Related documents link to each other
- **Searchable**: Consistent terminology and clear headings
- **Actionable**: Step-by-step procedures and code examples
- **Maintained**: Regular updates reflect actual codebase state

## Getting Help

1. **Search this documentation** for your topic
2. **Check the [Troubleshooting Guide](troubleshooting.md)** for common issues
3. **Review [GitHub Issues](https://github.com/alexfoley/ciso-work-cycle/issues)** for similar problems
4. **Create a new issue** using the appropriate template
5. **For security issues**: Follow the [Security Policy](../SECURITY.md) (do NOT create public issues)

---

**Questions?** Start with the [README](../README.md) for an overview, then explore topic-specific guides above.

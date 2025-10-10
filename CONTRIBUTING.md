# Contributing to CISO Work Cycle

Thank you for your interest in contributing to the CISO Work Cycle project! We welcome contributions from the security community and appreciate your help in making this tool better for CISOs everywhere.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment Setup](#development-environment-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Issue Guidelines](#issue-guidelines)
- [Security Contributions](#security-contributions)
- [Getting Help](#getting-help)

## Code of Conduct

This project adheres to professional open source standards. By participating, you are expected to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community and the project
- Show empathy towards other community members

## Getting Started

### Prerequisites

Ensure you have the following installed:

| Requirement | Minimum Version | Check Command |
|-------------|----------------|---------------|
| **Node.js** | 18.0.0+ | `node --version` |
| **npm** | 9.0.0+ | `npm --version` |
| **Git** | 2.0.0+ | `git --version` |

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR-USERNAME/ciso-work-cycle.git
cd ciso-work-cycle
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/alexfoley/ciso-work-cycle.git
```

## Development Environment Setup

### Initial Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application running.

### Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production bundle |
| `npm start` | Run production server |
| `npm run lint` | Run ESLint checks |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run update-data` | Validate and convert CSV project data |

## How to Contribute

### Types of Contributions

We welcome:

- **Bug fixes**: Resolve issues or unexpected behavior
- **Feature enhancements**: Improve existing functionality
- **Documentation**: Improve or add documentation
- **Tests**: Increase test coverage or improve test quality
- **Security improvements**: Enhance security posture
- **Performance optimizations**: Improve rendering or build performance
- **Accessibility improvements**: Enhance WCAG compliance

### Before You Start

1. **Check existing issues**: Search [GitHub Issues](https://github.com/alexfoley/ciso-work-cycle/issues) to avoid duplicate work
2. **Create an issue**: For significant changes, create an issue first to discuss approach
3. **Get assigned**: Wait for maintainer feedback before starting work

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Follow coding standards (see below)
   - Add tests for new functionality
   - Update documentation as needed

3. **Test thoroughly**:
   ```bash
   npm run lint        # Check code style
   npm test            # Run all tests
   npm run build       # Ensure production build works
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: Add your feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a pull request**: Use the PR template and provide detailed description

## Coding Standards

### TypeScript

- **Strict typing**: Use TypeScript strict mode, avoid `any` types
- **Interfaces over types**: Prefer `interface` for object shapes
- **Explicit return types**: Add return types to functions
- **Type exports**: Export types/interfaces for reusability

**Example:**
```typescript
// ✅ Good
interface Project {
  name: string;
  position: number;
}

export function getProject(id: string): Project | null {
  // ...
}

// ❌ Avoid
function getProject(id: any): any {
  // ...
}
```

### React Components

- **Functional components**: Use function components with hooks
- **Component naming**: Use PascalCase for components
- **Props typing**: Define explicit prop interfaces
- **File organization**: One component per file

**Example:**
```typescript
// ✅ Good
interface ProgressCurveProps {
  projects: Project[];
  width: number;
}

export function ProgressCurve({ projects, width }: ProgressCurveProps) {
  // ...
}
```

### Code Style

- **ESLint**: Follow the project's ESLint configuration
- **Formatting**: Use 2 spaces for indentation
- **Imports**: Group imports (React, libraries, local files)
- **Comments**: Add JSDoc comments for exported functions

**Run linting:**
```bash
npm run lint
```

### File Organization

```
components/
├── features/      # Core business logic components
└── layout/        # Layout components (Header, Sidebar)

lib/
├── data.ts       # Project data and types
└── utils.ts      # Utility functions

__tests__/        # Test files (mirror source structure)
```

## Testing Requirements

### Test Coverage Expectations

- **Core components**: 85%+ coverage (ProgressCurve, Header, Sidebar)
- **New features**: 80%+ coverage required
- **Bug fixes**: Add test case demonstrating the fix
- **Utility functions**: 100% coverage expected

### Writing Tests

Use Jest and React Testing Library:

```typescript
import { render, screen } from '@testing-library/react';
import { ProgressCurve } from '@/components/features/ProgressCurve';

describe('ProgressCurve', () => {
  it('renders projects on the curve', () => {
    const projects = [{ name: 'Test', position: 0.5, /* ... */ }];
    render(<ProgressCurve projects={projects} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Coverage reports** are generated in `coverage/` directory.

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Test coverage meets requirements (85%+ for core)
- [ ] Documentation updated (if applicable)
- [ ] SPDX license header added to new files

### PR Description Template

Use the provided pull request template (`.github/pull_request_template.md`):

- **Summary**: Clear description of changes
- **Issue reference**: Link to related issue(s)
- **Testing**: How you tested the changes
- **Screenshots**: For UI changes
- **Breaking changes**: Document if applicable

### Review Process

1. **Automated checks**: CI runs linting, tests, and build
2. **Maintainer review**: Code review from project maintainers
3. **Requested changes**: Address feedback and push updates
4. **Approval and merge**: Maintainer merges when approved

### After Merge

- Your contribution will be included in the next release
- You'll be credited in release notes
- Delete your feature branch

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Build process or tooling changes

### Examples

```bash
# Feature
git commit -m "feat(curve): Add zoom functionality to progress curve"

# Bug fix
git commit -m "fix(tooltip): Prevent tooltip overflow on small screens"

# Documentation
git commit -m "docs(readme): Update installation instructions"

# Breaking change
git commit -m "feat(data)!: Change project position to 0-100 range

BREAKING CHANGE: Project position now uses 0-100 range instead of 0-1"
```

### Commit Best Practices

- **Atomic commits**: One logical change per commit
- **Descriptive messages**: Explain why, not just what
- **Reference issues**: Include issue numbers (e.g., "Fixes #42")
- **Keep commits clean**: Squash WIP commits before PR

## Issue Guidelines

### Before Creating an Issue

1. **Search existing issues**: Avoid duplicates
2. **Check documentation**: Review README, ARCHITECTURE, and docs/
3. **Verify current version**: Use latest version

### Bug Reports

Use the bug report template (`.github/ISSUE_TEMPLATE/bug_report.md`):

- Clear title describing the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, browser)
- Screenshots or code samples

### Feature Requests

Use the feature request template (`.github/ISSUE_TEMPLATE/feature_request.md`):

- Clear description of the feature
- Use case and motivation
- Proposed implementation (optional)
- Alternative solutions considered

### Security Issues

**DO NOT** create public issues for security vulnerabilities.

See [SECURITY.md](SECURITY.md) for responsible disclosure process.

## Security Contributions

### Reporting Vulnerabilities

Follow the [Security Policy](SECURITY.md):

1. **Email**: security@forna.do
2. **Private disclosure**: Use GitHub Security Advisories
3. **Include details**: Reproduction steps, impact assessment

### Security Best Practices

When contributing, ensure:

- No hardcoded secrets or credentials
- Input validation for user-provided data
- Proper sanitization of rendered content
- No vulnerable dependencies (`npm audit` clean)
- Follow OWASP security guidelines

### Dependency Security

Before submitting:

```bash
# Check for vulnerabilities
npm audit

# Should show: found 0 vulnerabilities
```

## Getting Help

### Resources

- **Documentation**: [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- **ADRs**: [docs/adr/](docs/adr/) for architecture decisions
- **Data Management**: [docs/data-management.md](docs/data-management.md)
- **Testing Strategy**: [docs/testing-strategy.md](docs/testing-strategy.md)
- **Troubleshooting**: [docs/troubleshooting.md](docs/troubleshooting.md)

### Ask Questions

- **GitHub Discussions**: For general questions and discussions
- **GitHub Issues**: For specific bugs or feature requests
- **Pull Request Comments**: For code-specific questions

### Response Times

- **Issues**: Within 48 hours for initial response
- **Pull Requests**: Within 72 hours for review
- **Security**: Within 24 hours (see [SECURITY.md](SECURITY.md))

## License

By contributing to CISO Work Cycle, you agree that your contributions will be licensed under the **AGPL-3.0-or-later** license.

All new files must include the SPDX license header:

```typescript
// SPDX-License-Identifier: AGPL-3.0-or-later
```

See [LICENSE](LICENSE) for full license text.

---

**Thank you for contributing to CISO Work Cycle!** Your efforts help CISOs communicate security initiatives more effectively. 🔒

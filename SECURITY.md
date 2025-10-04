# Security Policy

## Supported Versions

The CISO Work Cycle maintains a single production version. Only the latest version receives security updates.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |
| < latest| :x:                |

## Reporting a Vulnerability

### How to Report

Please report security vulnerabilities through one of these channels:

1. **Email**: security@forna.do
2. **GitHub Security Advisories**: Use the "Security" tab in this repository
3. **Direct Contact**: Reach out to repository maintainers directly

### What to Include

When reporting a vulnerability, please provide:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Any proof-of-concept code (if applicable)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 5 business days
- **Resolution Target**: Based on severity (see below)

## Vulnerability Response Process

### Severity Classifications

| Severity | CVSS Score | Response Time | Example |
|----------|------------|---------------|---------|
| Critical | 9.0-10.0 | Immediate | Authorization bypass |
| High | 7.0-8.9 | 24 hours | Remote code execution |
| Moderate | 4.0-6.9 | 7 days | Cross-site scripting |
| Low | 0.1-3.9 | 30 days | Information disclosure |

## Dependency Management

### Proactive Security

We implement continuous security monitoring:

```bash
# Regular vulnerability scanning
npm audit

# Automatic updates for security patches
npm update --save
```

### Upgrade Decision Framework

| Vulnerability Count | Severity | Action |
|-------------------|----------|---------|
| Any | Critical | Immediate upgrade |
| Any | High | Within 24 hours |
| >5 | Moderate | Planned upgrade |
| >10 | Low | Quarterly review |

## Security Best Practices for Contributors

### Before Committing

1. **Run Security Audit**: `npm audit`
2. **Check Dependencies**: No new vulnerabilities introduced
3. **Review Secrets**: Ensure no API keys, tokens, or credentials
4. **Test Security**: Verify no XSS or injection vulnerabilities

### Security Checklist

- [ ] No hardcoded secrets or credentials
- [ ] No vulnerable dependencies (`npm audit` shows 0)
- [ ] Input validation on any user-provided data
- [ ] Content Security Policy headers maintained
- [ ] No use of `eval()` or dynamic code execution
- [ ] Proper sanitization of any rendered content

## Threat Model

### Current Security Architecture

As documented in [ARCHITECTURE.md](./ARCHITECTURE.md#security-architecture):

- **Static-only deployment**: No backend attack surface
- **Client-side data**: No external data transmission
- **Zero dependencies runtime**: Minimal supply chain risk
- **CSP Headers**: Strict content security policy

### Known Security Boundaries

1. **Build-time only**: All data processing happens during build
2. **No user input**: Application is read-only visualization
3. **No authentication**: Public or internally hosted only
4. **No data storage**: All data compiled into static assets

## Security Update Process

### For Maintainers

1. **Monitor**: GitHub Dependabot alerts
2. **Assess**: Review vulnerability severity and exploitability
3. **Test**: Verify fixes don't break functionality
4. **Document**: Update ADRs for significant changes
5. **Release**: Tag and document security releases

### For Users

1. **Watch**: Subscribe to repository security advisories
2. **Update**: Pull latest changes when security updates released
3. **Verify**: Run `npm audit` after updates
4. **Report**: File issues for any security concerns

## Related Documentation

- **[ADR-004: Next.js Security Upgrade Decision](./docs/adr/ADR-004-nextjs-security-upgrade.md)** - Security upgrade decision and process
- **[Architecture Security Section](./ARCHITECTURE.md#security-architecture)** - Client-side threat model and dependencies
- **[Contributing Guide](./CONTRIBUTING.md#security-contributions)** - Security contribution guidelines
- **[Troubleshooting Guide](./docs/troubleshooting.md)** - Debugging and issue resolution

## References

- [GitHub Security Advisories](https://github.com/security/advisories)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [npm Security Best Practices](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities)

---

*Last Security Assessment: September 30, 2025*
*Current Status: 0 known vulnerabilities*
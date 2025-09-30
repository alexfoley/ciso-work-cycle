# ADR-003: Data Management Strategy

**Status:** Accepted

**Date:** 2025-09-30

**Decision Makers:** CISO, Development Team, Information Security Team

## Context

The CISO Work Cycle requires a data management approach that balances several critical requirements:

1. **Executive Workflow**: CISOs need simple, fast data updates without technical complexity
2. **Security**: No sensitive project data should be transmitted or stored externally
3. **Performance**: Visualization must render instantly for board presentations
4. **Reliability**: Data integrity must be guaranteed for executive credibility
5. **Compliance**: Meet enterprise security and data governance standards

**Approaches Evaluated:**

| Approach | Security | Performance | CISO Usability | Complexity | Real-time |
|----------|----------|-------------|----------------|------------|-----------|
| **Client-side Static** | ✅ Excellent | ✅ Instant | ❌ Dev required | ✅ Simple | ❌ No |
| **Database + API** | ⚠️ Moderate | ⚠️ Network dependent | ✅ UI forms | ❌ Complex | ✅ Yes |
| **Client + CSV Import** | ✅ Excellent | ✅ Instant | ✅ Excel workflow | ✅ Simple | ❌ Build-time |
| **Real-time Sync** | ❌ External deps | ⚠️ Variable | ✅ Automatic | ❌ Very complex | ✅ Yes |

## Decision

**Selected: Client-side Static Data with CSV Enhancement Pipeline**

**Phase 1 (Current)**: Static TypeScript data model in `lib/data.ts`
- Compile-time type safety and validation
- Zero runtime dependencies or external calls
- Maximum security and performance

**Phase 2 (Future)**: CSV-to-TypeScript generation pipeline
- CISO maintains projects in Excel/CSV format
- Build-time script converts CSV to TypeScript
- Preserves security and performance benefits
- Executive-friendly workflow

```typescript
// Current: lib/data.ts
export const projects = [
  {
    name: 'Leadership',
    position: 0.15,
    category: 'Unplanned Work',
    risk: 'H',
    complexity: 'L',
    timeline: 'next month' as const
  },
  // ...
] as const;

// Future: Generated from project-data.csv
// name,position,category,risk,complexity,timeline
// "Leadership",0.15,"Unplanned Work","H","L","next month"
```

**Rejected Alternatives:**

- **Database + API**: Introduces attack surface, complexity, and network dependencies
- **Real-time Sync**: Over-engineering for current requirements, significant security risks
- **Manual TypeScript Editing**: Creates barrier for CISO data updates

## Consequences

### Positive

- **Security**: Zero external data transmission, no API endpoints to secure
- **Performance**: Instant rendering, no network latency
- **Reliability**: No database failures, connection issues, or sync problems
- **Compliance**: Data never leaves the build environment
- **Type Safety**: Compile-time validation prevents data errors
- **Executive Workflow**: CSV allows familiar Excel-based project management

### Negative

- **Real-time Updates**: Changes require build/deploy cycle
- **Collaboration**: No multi-user editing capabilities
- **Audit Trail**: No automatic change tracking
- **Scale Limitations**: Large datasets (1000+ projects) may impact build time

### Neutral

- **Backup/Recovery**: Standard git-based version control
- **Data Migration**: Simple CSV format enables easy export/import

## Security Impact

- **Threat Model Changes**:
  - ✅ Eliminates all data exfiltration vectors (no API, no database)
  - ✅ No authentication/authorization complexity
  - ✅ Zero server-side attack surface for data layer

- **Attack Surface**:
  - Minimal: Only build-time CSV processing script
  - Data exists only in version control and build artifacts
  - No runtime data fetching or user input processing

- **Compliance**:
  - Data residency: All data remains in corporate version control
  - Access control: Managed through existing git/GitHub permissions
  - Audit trail: Git commit history provides complete change tracking

## Implementation Notes

- **Timeline**: Phase 1 complete (static data), Phase 2 CSV pipeline planned for Q1 2026
- **Migration Strategy**: Existing TypeScript data easily exports to CSV for future pipeline
- **Rollback Plan**: Can revert to manual TypeScript editing if CSV pipeline proves problematic
- **Success Metrics**:
  - CISO can update project data in <5 minutes
  - Build time remains <10 seconds
  - Zero data-related security incidents

## Future Evolution Path

**Phase 3 (Conditional)**: API Integration for Large Enterprises
- Only if scale requirements exceed static approach
- Maintain security-first architecture
- Consider read-only API from existing project management tools

**Integration Candidates:**
- Linear (project management)
- Jira (issue tracking)
- ServiceNow (IT service management)

**Security Requirements for Future API:**
- Read-only access
- On-premises or private cloud deployment
- Strong authentication (SSO/SAML)
- Comprehensive audit logging

## References

- [Next.js Static Data Fetching](https://nextjs.org/docs/basic-features/data-fetching/get-static-props)
- [TypeScript const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)
- Related: [ADR-001: Technology Stack Selection](./ADR-001-technology-stack-selection.md)

---

*This ADR follows the format established by Michael Nygard in "Documenting Architecture Decisions"*
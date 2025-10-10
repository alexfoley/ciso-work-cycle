# ADR-006: Component Library Simplification

**Status:** Accepted

**Date:** 2025-10-06

**Decision Makers:** Development Team, Architecture Review

## Context

During repository audit, we discovered significant code bloat: 47 Shadcn/UI components (8,150+ lines of code) were included in the `components/ui/` directory but **none were actually used** in the application.

**Reality of Component Usage:**
- ❌ **Shadcn/UI components**: 0 imports found in codebase
- ✅ **Custom components**: 3 components (ProgressCurve, Header, Sidebar)
- ✅ **Utility functions**: Only `cn()` from lib/utils.ts used

**Initial Assessment (ADR-005):**
- [ADR-005](./ADR-005-design-system-architecture.md) documented the decision to adopt Shadcn/UI
- Decision was sound: Tailwind CSS + component library for rapid development
- However, implementation reality diverged: custom SVG visualization didn't require UI primitives

**Impact of Unused Components:**
- **Codebase bloat**: 8,150+ lines of unused code
- **Maintenance burden**: False impression of dependencies
- **Security surface**: Unnecessary code to audit and maintain
- **Developer confusion**: Unclear which components are actually used

## Decision

**Remove all unused Shadcn/UI components** while retaining the valuable parts of the design system architecture:

**What We're Removing:**
- 47 Shadcn/UI components from `components/ui/`
- `hooks/use-toast.ts` (only used by toast components)
- Component dependencies still in package.json (for potential future use)

**What We're Keeping:**
- ✅ Tailwind CSS design system (8px grid, responsive breakpoints)
- ✅ Design tokens and CSS variables in globals.css
- ✅ `cn()` utility function for className merging
- ✅ Custom components (ProgressCurve, Header, Sidebar)

**Rationale:**
1. **YAGNI Principle**: "You Aren't Gonna Need It" - remove speculative code
2. **Maintainability**: Reduce codebase to only what's actively used
3. **Security**: Smaller attack surface, fewer dependencies to audit
4. **Clarity**: Documentation now matches actual implementation
5. **Flexibility**: Can easily re-add specific components when needed

## Consequences

### Positive

- **Reduced Codebase**: 8,150 fewer lines of code to maintain
- **Improved Clarity**: Documentation accurately reflects implementation
- **Faster Builds**: Fewer files to process during compilation
- **Reduced Confusion**: Developers see only what's actually used
- **Maintained Quality**: Design system principles (Tailwind, tokens) still apply
- **Security Baseline**: Smaller attack surface, fewer dependencies

### Negative

- **Re-addition Effort**: If future features need UI components, must re-add them
- **Lost Reference**: No in-repo examples of Shadcn/UI patterns
- **Documentation Overhead**: Must update ADR-005 context

### Neutral

- **Package Dependencies**: Keeping Radix dependencies in package.json for flexibility
- **Future Growth**: Can selectively add components as needed
- **Design System**: Core principles remain, just implemented differently

## Implementation Notes

- **Timeline**: Repository cleanup completed 2025-10-06
- **Changes Made**:
  - Removed 47 components from `components/ui/`
  - Removed `hooks/use-toast.ts`
  - Updated .gitignore for better hygiene
  - Updated documentation across README, ARCHITECTURE, CONTRIBUTING, ADR-001
- **Migration Strategy**: No migration needed (components were unused)
- **Rollback Plan**: Components available in git history or can be re-added from Shadcn/UI
- **Verification**:
  - ✅ Build successful: `npm run build` passes
  - ✅ No broken imports
  - ✅ Tests pass with no modifications
  - ✅ Application functionality unchanged

## Lessons Learned

1. **Audit Early**: Regular codebase audits prevent accumulation of unused code
2. **Implementation Reality**: Initial architectural decisions should be validated against actual usage
3. **Documentation Alignment**: Keep documentation synchronized with reality
4. **Lean Approach**: Start minimal, add complexity only when proven necessary
5. **Component Libraries**: Consider selective adoption rather than wholesale inclusion

## Future Considerations

**When to Re-Add Components:**
- New features require complex UI primitives (modals, dropdowns, etc.)
- Need for form components beyond basic inputs
- Requirement for advanced interactions (drag-drop, etc.)

**How to Re-Add:**
```bash
# Selectively add only needed components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
```

**Alternative Approaches:**
- Build custom components as needed (current approach)
- Use headless UI libraries (Radix, Headless UI) directly
- Adopt different component library if requirements change

## Related ADRs

- [ADR-001: Technology Stack Selection](./ADR-001-technology-stack-selection.md) - Updated to reflect custom components
- [ADR-005: Design System Architecture](./ADR-005-design-system-architecture.md) - Context for original Shadcn/UI decision

## References

- [YAGNI Principle](https://martinfowler.com/bliki/Yagni.html)
- [Shadcn/UI Documentation](https://ui.shadcn.com/)
- [Repository Cleanup PR #24](https://github.com/alexfoley/ciso-work-cycle/pull/24)

---

*This ADR follows the format established by Michael Nygard in "Documenting Architecture Decisions"*

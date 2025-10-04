# Troubleshooting Guide

This guide provides solutions to common issues encountered when developing, building, or running the CISO Work Cycle application.

## Table of Contents

- [Quick Diagnostics](#quick-diagnostics)
- [Installation Issues](#installation-issues)
- [Development Server Issues](#development-server-issues)
- [Build and Production Issues](#build-and-production-issues)
- [Data Management Issues](#data-management-issues)
- [Visualization and Rendering Issues](#visualization-and-rendering-issues)
- [Testing Issues](#testing-issues)
- [Performance Issues](#performance-issues)
- [Browser Compatibility Issues](#browser-compatibility-issues)
- [Debugging Tools and Techniques](#debugging-tools-and-techniques)
- [Getting Help](#getting-help)

## Quick Diagnostics

Before troubleshooting specific issues, run these diagnostic checks:

```bash
# Check Node.js version (requires 18.0.0+)
node --version

# Check npm version (requires 9.0.0+)
npm --version

# Check for dependency vulnerabilities
npm audit

# Verify installation integrity
npm list --depth=0

# Check Git status
git status
```

## Installation Issues

### Issue: `npm install` Fails with Permission Errors

**Symptoms:**
```
Error: EACCES: permission denied
```

**Solution:**

```bash
# macOS/Linux: Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm (Node Version Manager) - recommended
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

**Windows:**
- Run terminal as Administrator
- Or use [nvm-windows](https://github.com/coreybutler/nvm-windows)

---

### Issue: `npm install` Fails with Network Errors

**Symptoms:**
```
Error: ETIMEDOUT
Error: ECONNREFUSED
```

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Use different registry (if corporate firewall)
npm config set registry https://registry.npmjs.org/

# Install with increased timeout
npm install --fetch-timeout=60000

# Check proxy settings (corporate environments)
npm config get proxy
npm config get https-proxy
```

---

### Issue: Incompatible Node.js Version

**Symptoms:**
```
Error: The engine "node" is incompatible with this module
```

**Solution:**

```bash
# Check current version
node --version

# Install correct version (18.0.0+)
nvm install 20
nvm use 20

# Verify
node --version
npm --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Development Server Issues

### Issue: Port 3000 Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

**macOS/Linux:**
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

**Windows:**
```cmd
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

---

### Issue: Hot Reload Not Working

**Symptoms:**
- Changes to files don't trigger automatic reload
- Browser doesn't update when saving files

**Solution:**

```bash
# 1. Clear Next.js cache
rm -rf .next

# 2. Restart development server
npm run dev

# 3. If still not working, check file watcher limits (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# 4. Disable antivirus file watching (Windows)
# Add project directory to antivirus exclusions
```

---

### Issue: Module Not Found Errors

**Symptoms:**
```
Error: Cannot find module 'next'
Error: Module not found: Can't resolve '@/components/...'
```

**Solution:**

```bash
# 1. Verify dependencies are installed
npm list next react react-dom

# 2. Clear and reinstall
rm -rf node_modules package-lock.json .next
npm install

# 3. Check TypeScript paths (tsconfig.json)
# Ensure paths alias is configured:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# 4. Restart development server
npm run dev
```

## Build and Production Issues

### Issue: Build Fails with Type Errors

**Symptoms:**
```
Error: Type 'string' is not assignable to type 'number'
Type error: Property 'x' does not exist on type 'Y'
```

**Solution:**

```bash
# 1. Check TypeScript version
npm list typescript
# Should be 5.3.3

# 2. Clear TypeScript cache
rm -rf .next tsconfig.tsbuildinfo

# 3. Run type check
npx tsc --noEmit

# 4. Fix type errors in source files
# Check the error messages for specific file/line numbers

# 5. Rebuild
npm run build
```

---

### Issue: Build Fails with Out of Memory

**Symptoms:**
```
FATAL ERROR: Reached heap limit Allocation failed
JavaScript heap out of memory
```

**Solution:**

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or add to package.json scripts:
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}

# For Windows (PowerShell):
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

### Issue: Production Build Size Too Large

**Symptoms:**
- Build warnings about large bundle sizes
- Slow page load times

**Solution:**

```bash
# 1. Analyze bundle size
npm run build

# 2. Check for duplicate dependencies
npm dedupe

# 3. Review bundle composition
# Look at build output for large chunks

# 4. Dynamic imports for large components (if needed)
# Example:
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

## Data Management Issues

### Issue: CSV Update Fails with Position Errors

**Symptoms:**
```
Error: Position must be between 0.0 and 1.0
Validation failed for row X
```

**Solution:**

**Check CSV format:**
```csv
name,position,category,risk,complexity,timeline
"Zero Trust",0.3,"IS Projects","H","H","next quarter"
```

**Common mistakes:**
- ❌ Position as percentage: `30%` → ✅ Use decimal: `0.3`
- ❌ Wrong category: `"Security"` → ✅ Use exact: `"IS Projects"`
- ❌ Invalid timeline: `"Q2"` → ✅ Use: `"next quarter"`

**Valid values:**
- **Position**: `0.0` to `1.0` (e.g., `0.25`, `0.5`, `0.75`)
- **Category**: `"Unplanned Work"`, `"IS Projects"`, `"IT/Business Projects"`, `"Business-as-Usual"`
- **Risk/Complexity**: `"L"`, `"M"`, `"H"`
- **Timeline**: `"next month"`, `"next quarter"`, `"next half"`, `"next year"`, `"on hold"`

**Debug:**
```bash
# Run validation script
npm run update-data

# Check validation errors in output
# Fix line numbers mentioned in errors
```

See [docs/data-management.md](./data-management.md) for complete guide.

---

### Issue: Projects Not Appearing on Curve

**Symptoms:**
- CSV validates successfully
- Projects don't render on visualization

**Solution:**

```bash
# 1. Verify data was generated
cat lib/data.ts | grep "export const projects"

# 2. Check for TypeScript errors
npx tsc --noEmit

# 3. Clear Next.js cache
rm -rf .next

# 4. Restart development server
npm run dev

# 5. Check browser console for errors
# Press F12 → Console tab
```

## Visualization and Rendering Issues

### Issue: SVG Curve Not Rendering

**Symptoms:**
- Blank screen where curve should appear
- Console errors about SVG elements

**Solution:**

**Check browser console (F12 → Console):**

```javascript
// Look for errors like:
"Cannot read property 'getPointAtLength' of null"
"SVG path data is invalid"
```

**Fixes:**

```bash
# 1. Verify project data is valid
# Check lib/data.ts has projects array

# 2. Clear cache and rebuild
rm -rf .next node_modules/.cache
npm run dev

# 3. Check viewport dimensions
# Curve requires minimum width (320px)
```

---

### Issue: Tooltips Overflow Screen

**Symptoms:**
- Tooltip content gets cut off
- Tooltips appear off-screen

**Solution:**

This is a known behavior on small screens. The tooltip positioning system attempts to:
1. Position on right side (preferred)
2. Fall back to left if right overflows
3. Adjust vertical position if needed

**Workaround:**
- Zoom out browser (Cmd/Ctrl + -)
- Use larger screen for development
- Tooltips auto-adjust on final build

---

### Issue: Curve Appears Distorted on Mobile

**Symptoms:**
- Curve shape incorrect on small screens
- Projects positioned incorrectly

**Solution:**

```bash
# 1. Clear browser cache
# Ctrl+Shift+Delete → Clear cache

# 2. Test with responsive design mode
# Chrome DevTools → Toggle device toolbar (Cmd+Shift+M)

# 3. Verify responsive breakpoints work
# Test at: 375px (mobile), 768px (tablet), 1920px (desktop)

# 4. Check for CSS conflicts
# Disable browser extensions that modify CSS
```

## Testing Issues

### Issue: Tests Failing After Installation

**Symptoms:**
```
Error: Cannot find module 'jest'
Tests fail with import errors
```

**Solution:**

```bash
# 1. Verify dev dependencies installed
npm list jest @testing-library/react

# 2. Clear Jest cache
npm test -- --clearCache

# 3. Reinstall testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# 4. Run tests
npm test
```

---

### Issue: Test Coverage Too Low

**Symptoms:**
```
Coverage threshold not met:
  Branches: 75% < 85%
```

**Solution:**

```bash
# 1. Generate detailed coverage report
npm run test:coverage

# 2. Open coverage report
open coverage/lcov-report/index.html

# 3. Identify uncovered lines (red highlights)

# 4. Add tests for uncovered code
# Focus on core components (ProgressCurve, Header, Sidebar)

# 5. Verify coverage improved
npm run test:coverage
```

---

### Issue: Snapshot Tests Failing

**Symptoms:**
```
Snapshot mismatch - 3 snapshots failed
```

**Solution:**

```bash
# 1. Review snapshot changes
npm test

# 2. If changes are intentional, update snapshots
npm test -- -u

# 3. If changes are NOT intentional, fix component code
# Revert changes or fix bugs

# 4. Commit updated snapshots
git add __tests__/__snapshots__/
git commit -m "test: Update snapshots for component changes"
```

## Performance Issues

### Issue: Slow Page Load Times

**Symptoms:**
- Initial page load > 5 seconds
- Large Time to First Byte (TTFB)

**Solution:**

```bash
# 1. Profile with Lighthouse
# Chrome DevTools → Lighthouse → Analyze page load

# 2. Check bundle size
npm run build
# Look for warnings about large chunks

# 3. Verify static generation
# Next.js should output: "○ (Static)"

# 4. Test production build locally
npm run build
npm start
# Production is faster than development

# 5. Check network tab (F12 → Network)
# Ensure assets load from cache
```

---

### Issue: High Memory Usage During Development

**Symptoms:**
- Development server becomes slow
- System runs out of memory
- Browser tab crashes

**Solution:**

```bash
# 1. Close unnecessary browser tabs

# 2. Disable source maps in development (temporary)
# next.config.js:
module.exports = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = false;
    }
    return config;
  }
};

# 3. Restart development server periodically
# Kill and restart: npm run dev

# 4. Increase system swap/virtual memory
```

---

### Issue: Slow Curve Rendering with Many Projects

**Symptoms:**
- Lag when hovering over projects
- Slow scrolling/interactions

**Solution:**

**Optimization checklist:**
- Limit projects to 100-150 maximum
- Use production build for testing large datasets
- Profile with React DevTools Profiler
- Check for unnecessary re-renders

```bash
# Test production performance
npm run build
npm start

# Profile component rendering
# React DevTools → Profiler → Start profiling
```

## Browser Compatibility Issues

### Issue: Application Not Working in Safari

**Symptoms:**
- Blank screen in Safari
- Console errors about unsupported features

**Solution:**

```bash
# 1. Clear Safari cache
# Safari → Preferences → Privacy → Manage Website Data → Remove All

# 2. Check Safari version (requires Safari 15+)
# Safari → About Safari

# 3. Enable Developer Console
# Safari → Preferences → Advanced → Show Develop menu
# Check Console for specific errors

# 4. Test in other browsers to isolate issue
```

---

### Issue: Application Not Working in Firefox

**Symptoms:**
- SVG rendering issues
- TypeScript errors in console

**Solution:**

```bash
# 1. Check Firefox version (requires Firefox 100+)
# Firefox → About Firefox

# 2. Disable browser extensions
# Menu → Add-ons → Disable all extensions → Restart

# 3. Clear Firefox cache
# Ctrl+Shift+Delete → Everything → Clear Now

# 4. Check browser console for specific errors
# F12 → Console
```

## Debugging Tools and Techniques

### Browser Developer Tools

**Chrome/Edge DevTools:**
```
F12 or Cmd+Option+I (Mac)

Key tabs:
- Console: JavaScript errors and logs
- Network: Resource loading and timing
- Performance: Profiling and performance analysis
- Application: Local storage, cache inspection
```

**Useful console commands:**
```javascript
// Check React version
React.version

// Inspect component props
$r.props  // (select component in React DevTools first)

// Check project data
import { projects } from './lib/data';
console.log(projects);
```

### Next.js Debugging

**Enable debug mode:**
```bash
# Verbose build output
npm run build -- --debug

# Development with inspector
NODE_OPTIONS='--inspect' npm run dev

# Then open: chrome://inspect
```

**Check build output:**
```bash
npm run build

# Look for:
# ○ (Static)  - Static page (good)
# λ (Lambda)  - Server-rendered (unexpected for this app)
```

### React DevTools

Install [React Developer Tools](https://react.dev/learn/react-developer-tools):
- Chrome/Edge: Install from extension store
- Firefox: Install from add-ons store

**Usage:**
1. Open DevTools (F12)
2. Click "Components" or "Profiler" tab
3. Inspect component tree and props
4. Profile performance issues

### TypeScript Debugging

```bash
# Check types without building
npx tsc --noEmit

# Watch mode for type checking
npx tsc --noEmit --watch

# Generate declaration files for inspection
npx tsc --declaration --emitDeclarationOnly
```

### Network Debugging

```bash
# Test localhost from another device
# 1. Get your IP address
# macOS/Linux:
ifconfig | grep "inet " | grep -v 127.0.0.1

# 2. Start dev server
npm run dev

# 3. Access from another device
# http://YOUR_IP_ADDRESS:3000

# Check firewall allows port 3000
```

## Getting Help

### Self-Service Resources

1. **Search existing issues**: [GitHub Issues](https://github.com/alexfoley/ciso-work-cycle/issues)
2. **Check documentation**:
   - [README.md](../README.md) - Quick start and overview
   - [ARCHITECTURE.md](../ARCHITECTURE.md) - Technical details
   - [CONTRIBUTING.md](../CONTRIBUTING.md) - Development guidelines
   - [docs/data-management.md](./data-management.md) - CSV workflow
3. **Review ADRs**: [docs/adr/](./adr/) - Architecture decisions

### Report an Issue

**Before creating an issue:**
- [ ] Search for existing issues
- [ ] Try troubleshooting steps above
- [ ] Gather error messages and logs
- [ ] Note your environment (OS, Node version, browser)

**Create an issue:**
- Use [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Include reproduction steps
- Provide environment details
- Attach screenshots if applicable

### Security Issues

**DO NOT** create public issues for security vulnerabilities.

See [SECURITY.md](../SECURITY.md) for responsible disclosure:
- Email: security@forna.do
- Expected response: 48 hours

### Community Support

- **GitHub Discussions**: General questions and help
- **Pull Requests**: Code contributions with questions
- **Documentation**: All guides in `docs/` directory

---

**Still stuck?** Open an issue with:
- Error messages (full text)
- Steps to reproduce
- Environment details (`node --version`, `npm --version`, OS, browser)
- What you've tried from this guide

We're here to help! 🔧

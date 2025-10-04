# SPDX-License-Identifier: AGPL-3.0-or-later
# SPDX-FileCopyrightText: 2025 Alex Foley

# Executive Data Management Guide

**Target Audience**: CISOs, Executive Assistants, Security Team Members
**Time Required**: 5 minutes for updates
**Technical Knowledge**: None required

## Quick Start for Busy Executives

### 📊 Update Project Data in 3 Steps

1. **Edit the CSV file** in Excel or Google Sheets
2. **Run the update command**: `npm run update-data`
3. **View updated visualization**: `npm run dev`

**That's it!** No code editing required.

---

## Understanding Your Project Data

### Project Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| **Unplanned Work** | Emergency initiatives | Incident response, urgent compliance |
| **IS Projects** | Security-focused projects | Identity management, security tools |
| **IT/Business Projects** | Cross-functional initiatives | Cloud migration, digital transformation |
| **Business-as-Usual** | Ongoing operations | Vulnerability management, governance |

### Timeline Markers

| Symbol | Timeline | When to Use |
|--------|----------|-------------|
| ○ | Next Month | Immediate priorities |
| ● | Next Quarter | This quarter's deliverables |
| △ | Next Half | 6-month planning horizon |
| ▲ | Next Year | Annual strategic initiatives |
| ⊗ | On Hold | Paused or deferred projects |

### Risk & Complexity Levels

- **L** = Low
- **M** = Medium
- **H** = High

---

## Step-by-Step Data Update Process

### Step 1: Open the CSV Template

1. Navigate to your project folder
2. Open `project-data-template.csv` in Excel
3. You'll see columns: Project Name, Position, Category, Risk, Complexity, Timeline, Notes

### Step 2: Update Your Data

**Adding a New Project:**
```
Project Name: Zero Trust Implementation
Position: 0.3
Category: IS Projects
Risk: H
Complexity: H
Timeline: next quarter
Notes: Critical security architecture update
```

**Position Values (0.0 to 1.0):**
- **0.0-0.2**: Early innovation, high uncertainty
- **0.3-0.5**: Gaining momentum, proving value
- **0.6-0.8**: Mature, established approach
- **0.9-1.0**: Commodity, standard practice

### Step 3: Run the Update

1. Save your CSV file
2. Open Terminal/Command Prompt
3. Navigate to project folder: `cd path/to/ciso-work-cycle`
4. Run: `npm run update-data`
5. Wait for success message

### Step 4: View Your Updates

Run: `npm run dev`

Your visualization will open in your browser with updated data.

---

## Troubleshooting Common Issues

### ❌ Error: "Project Name is required"
**Fix:** Ensure every row has a project name in the first column

### ❌ Error: "Position must be between 0.0 and 1.0"
**Fix:** Check position values are decimals like 0.3, not percentages like 30%

### ❌ Error: "Invalid category"
**Fix:** Use exact categories: "Unplanned Work", "IS Projects", "IT/Business Projects", "Business-as-Usual"

### ❌ Error: "Invalid timeline"
**Fix:** Use exact options: "next month", "next quarter", "next half", "next year", "on hold"

### 🔧 Script Won't Run
1. Ensure you're in the project folder
2. Check CSV file is saved properly
3. Restart terminal and try again

---

## Data Best Practices

### Consistency Guidelines

- **Use consistent naming** for similar projects
- **Update regularly** (monthly or before key presentations)
- **Archive completed projects** rather than deleting
- **Document major changes** in the Notes field

### Position Guidance

Think of position as "maturity on the curve":

- **0.1-0.2**: Experimental, research phase
- **0.3-0.4**: Pilot projects, proof of concept
- **0.5-0.6**: Implementation phase
- **0.7-0.8**: Deployment and adoption
- **0.9**: Mature, business-as-usual

### Executive Communication

**For Strategic Updates:**
- Focus on movement along the curve
- Highlight risk mitigation progress
- Emphasize strategic alignment
- Note resource requirements for high-complexity items

---

## Related Documentation

- **[Troubleshooting Guide](troubleshooting.md)** - Comprehensive solutions for development and runtime issues
- **[Contributing Guide](../CONTRIBUTING.md)** - Developer workflow and code standards
- **[Architecture Documentation](../ARCHITECTURE.md)** - Technical architecture and design decisions
- **[Testing Strategy](testing-strategy.md)** - Testing approach and coverage requirements

---

*This guide transforms complex project portfolio management into a simple, executive-friendly workflow. No coding knowledge required.*
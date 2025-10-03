// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2025 Alex Foley

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CSV_FILE = 'project-data-template.csv';
const DATA_FILE = 'lib/data.ts';
const BACKUP_FILE = 'lib/data.ts.backup';

const VALID_CATEGORIES = [
  'Unplanned Work',
  'IS Projects',
  'IT/Business Projects',
  'Business-as-Usual'
];

const VALID_RISK_LEVELS = ['L', 'M', 'H'];
const VALID_COMPLEXITY_LEVELS = ['L', 'M', 'H'];
const VALID_TIMELINES = [
  'next month',
  'next quarter',
  'next half',
  'next year',
  'on hold'
];

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };

  console.log(`${colors[type]}${message}${colors.reset}`);
}

function validateRow(row, index) {
  const errors = [];

  if (!row['Project Name'] || row['Project Name'].trim() === '') {
    errors.push(`Row ${index + 2}: Project Name is required`);
  }

  const position = parseFloat(row.Position);
  if (isNaN(position) || position < 0 || position > 1) {
    errors.push(`Row ${index + 2}: Position must be a number between 0.0 and 1.0`);
  }

  if (!VALID_CATEGORIES.includes(row.Category)) {
    errors.push(`Row ${index + 2}: Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (!VALID_RISK_LEVELS.includes(row.Risk)) {
    errors.push(`Row ${index + 2}: Risk must be one of: ${VALID_RISK_LEVELS.join(', ')}`);
  }

  if (!VALID_COMPLEXITY_LEVELS.includes(row.Complexity)) {
    errors.push(`Row ${index + 2}: Complexity must be one of: ${VALID_COMPLEXITY_LEVELS.join(', ')}`);
  }

  if (!VALID_TIMELINES.includes(row.Timeline)) {
    errors.push(`Row ${index + 2}: Timeline must be one of: ${VALID_TIMELINES.join(', ')}`);
  }

  return errors;
}

function parseCsv(content) {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }

  return rows;
}

function generateTypescriptData(projects) {
  const projectsArray = projects.map(project => {
    return `  {
    name: '${project['Project Name']}',
    position: ${parseFloat(project.Position)},
    category: '${project.Category}',
    risk: '${project.Risk}',
    complexity: '${project.Complexity}',
    timeline: '${project.Timeline}' as const
  }`;
  }).join(',\n');

  return `// Project data with relative positions (0-1 along the curve)
export const projects = [
${projectsArray}
] as const;

export type Project = (typeof projects)[number];
export type Timeline = (typeof projects)[number]['timeline'];

// Timeline markers for the curve
export const timelineMarkers = {
  'next month': '○',
  'next quarter': '●',
  'next half': '△',
  'next year': '▲',
  'on hold': '⊗'
} as const;

// Project categories for executive understanding
export const projectCategories = {
  'Unplanned Work': 'hsl(var(--destructive))',
  'IS Projects': 'hsl(var(--primary))',
  'IT/Business Projects': 'hsl(var(--secondary))',
  'Business-as-Usual': 'hsl(var(--muted))'
} as const;
`;
}

function main() {
  log('🚀 Starting CSV to TypeScript data conversion...', 'info');

  // Check if CSV file exists
  if (!fs.existsSync(CSV_FILE)) {
    log(`❌ CSV file not found: ${CSV_FILE}`, 'error');
    log('Please create the CSV file using the template structure.', 'error');
    process.exit(1);
  }

  try {
    // Create backup of existing data.ts
    if (fs.existsSync(DATA_FILE)) {
      fs.copyFileSync(DATA_FILE, BACKUP_FILE);
      log(`✅ Backup created: ${BACKUP_FILE}`, 'success');
    }

    // Read and parse CSV
    const csvContent = fs.readFileSync(CSV_FILE, 'utf8');
    const projects = parseCsv(csvContent);

    log(`📊 Parsed ${projects.length} projects from CSV`, 'info');

    // Validate all data
    let allErrors = [];
    const projectNames = new Set();

    projects.forEach((project, index) => {
      const errors = validateRow(project, index);
      allErrors = allErrors.concat(errors);

      // Check for duplicate names
      if (projectNames.has(project['Project Name'])) {
        allErrors.push(`Row ${index + 2}: Duplicate project name "${project['Project Name']}"`);
      } else {
        projectNames.add(project['Project Name']);
      }
    });

    if (allErrors.length > 0) {
      log('❌ Validation errors found:', 'error');
      allErrors.forEach(error => log(`  ${error}`, 'error'));

      // Restore backup if it exists
      if (fs.existsSync(BACKUP_FILE)) {
        log('🔄 Restoring original data.ts file...', 'warning');
        fs.copyFileSync(BACKUP_FILE, DATA_FILE);
        fs.unlinkSync(BACKUP_FILE);
      }

      process.exit(1);
    }

    // Generate TypeScript content
    const tsContent = generateTypescriptData(projects);

    // Write to data.ts
    fs.writeFileSync(DATA_FILE, tsContent);

    log('✅ Successfully updated data.ts!', 'success');
    log(`📈 Updated ${projects.length} projects`, 'success');

    // Show summary of changes
    log('\n📋 Project Summary:', 'info');
    projects.forEach(project => {
      log(`  • ${project['Project Name']} (${project.Category}, ${project.Timeline})`, 'info');
    });

    // Clean up backup
    if (fs.existsSync(BACKUP_FILE)) {
      fs.unlinkSync(BACKUP_FILE);
    }

    log('\n🎉 Data conversion completed successfully!', 'success');
    log('You can now run "npm run dev" to see your changes.', 'info');

  } catch (error) {
    log(`❌ Error during conversion: ${error.message}`, 'error');

    // Restore backup if it exists
    if (fs.existsSync(BACKUP_FILE)) {
      log('🔄 Restoring original data.ts file...', 'warning');
      fs.copyFileSync(BACKUP_FILE, DATA_FILE);
      fs.unlinkSync(BACKUP_FILE);
    }

    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateRow, parseCsv, generateTypescriptData };
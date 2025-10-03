#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SPDX_HEADER_TS = `// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2025 Alex Foley

`;

const SPDX_HEADER_CONFIG = `# SPDX-License-Identifier: AGPL-3.0-or-later
# SPDX-FileCopyrightText: 2025 Alex Foley

`;

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

function hasLicenseHeader(content) {
  return content.includes('SPDX-License-Identifier: AGPL-3.0-or-later') ||
         content.includes('SPDX-FileCopyrightText: 2025 Alex Foley');
}

function addSPDXHeader(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const ext = path.extname(filePath);

    if (hasLicenseHeader(content)) {
      log(`⏭️  Skipping ${filePath} (already has SPDX header)`, 'info');
      return false;
    }

    let newContent;
    if (['.md', '.yml', '.yaml'].includes(ext)) {
      newContent = SPDX_HEADER_CONFIG + content;
    } else {
      newContent = SPDX_HEADER_TS + content;
    }

    fs.writeFileSync(filePath, newContent);
    log(`✅ Added SPDX header to ${filePath}`, 'success');
    return true;
  } catch (error) {
    log(`❌ Error processing ${filePath}: ${error.message}`, 'error');
    return false;
  }
}

function processDirectory(dir, extensions) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let processed = 0;

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      if (['node_modules', '.next', '.git', 'out', 'dist'].includes(file.name)) {
        continue;
      }
      processed += processDirectory(filePath, extensions);
    } else if (file.isFile()) {
      const ext = path.extname(file.name);
      if (extensions.includes(ext)) {
        if (addSPDXHeader(filePath)) {
          processed++;
        }
      }
    }
  }

  return processed;
}

function main() {
  log('🚀 Adding SPDX license headers (2025 best practice)...', 'info');

  const sourceExtensions = ['.ts', '.tsx', '.js', '.jsx'];
  let totalProcessed = 0;

  totalProcessed += processDirectory('.', sourceExtensions);

  // Process README
  if (fs.existsSync('README.md')) {
    if (addSPDXHeader('README.md')) {
      totalProcessed++;
    }
  }

  log(`\n🎉 Added SPDX headers to ${totalProcessed} files!`, 'success');
  log('Modern 2-line headers maintain code statistics integrity.', 'info');
}

if (require.main === module) {
  main();
}

module.exports = { addSPDXHeader, hasLicenseHeader };
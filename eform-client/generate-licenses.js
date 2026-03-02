#!/usr/bin/env node

/**
 * This script generates a comprehensive list of all dependencies (including nested)
 * from package.json, yarn.lock for Node packages
 * Output: src/assets/licenses.json
 */

const fs = require('fs');
const path = require('path');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Parse yarn.lock to get all dependencies with versions
function parseYarnLock() {
  const yarnLockContent = fs.readFileSync('yarn.lock', 'utf8');
  const packages = new Map();
  
  // Simple parser for yarn.lock format
  const lines = yarnLockContent.split('\n');
  let currentPackage = null;
  let currentVersion = null;
  
  for (const line of lines) {
    // Package declaration line (starts with package name)
    if (line && !line.startsWith(' ') && !line.startsWith('#') && line.includes('@')) {
      // Extract package name (handle scoped packages)
      const match = line.match(/^"?(@?[^@\s]+)@([^"]+)"?:/);
      if (match) {
        currentPackage = match[1];
      }
    } else if (line.trim().startsWith('version ') && currentPackage) {
      // Extract version
      const versionMatch = line.match(/version\s+"([^"]+)"/);
      if (versionMatch) {
        currentVersion = versionMatch[1];
        if (!packages.has(currentPackage)) {
          packages.set(currentPackage, {
            name: currentPackage,
            version: currentVersion,
            isDirect: false
          });
        }
      }
    }
  }
  
  return packages;
}

// Mark direct dependencies
function markDirectDependencies(packages) {
  const directDeps = {
    ...packageJson.dependencies || {},
    ...packageJson.devDependencies || {}
  };
  
  for (const [name, info] of packages.entries()) {
    if (directDeps[name]) {
      info.isDirect = true;
    }
  }
  
  return packages;
}

// Generate license information based on common patterns
function getLicenseInfo(packageName) {
  // Map of known licenses for major packages
  const knownLicenses = {
    // Angular
    '@angular/animations': { license: 'MIT', repo: 'https://github.com/angular/angular' },
    '@angular/common': { license: 'MIT', repo: 'https://github.com/angular/angular' },
    '@angular/compiler': { license: 'MIT', repo: 'https://github.com/angular/angular' },
    '@angular/core': { license: 'MIT', repo: 'https://github.com/angular/angular' },
    '@angular/forms': { license: 'MIT', repo: 'https://github.com/angular/angular' },
    '@angular/platform-browser': { license: 'MIT', repo: 'https://github.com/angular/angular' },
    '@angular/platform-browser-dynamic': { license: 'MIT', repo: 'https://github.com/angular/angular' },
    '@angular/router': { license: 'MIT', repo: 'https://github.com/angular/angular' },
    '@angular/cdk': { license: 'MIT', repo: 'https://github.com/angular/components' },
    '@angular/material': { license: 'MIT', repo: 'https://github.com/angular/components' },
    
    // NgRx
    '@ngrx/store': { license: 'MIT', repo: 'https://github.com/ngrx/platform' },
    '@ngrx/effects': { license: 'MIT', repo: 'https://github.com/ngrx/platform' },
    '@ngrx/entity': { license: 'MIT', repo: 'https://github.com/ngrx/platform' },
    '@ngrx/store-devtools': { license: 'MIT', repo: 'https://github.com/ngrx/platform' },
    
    // RxJS
    'rxjs': { license: 'Apache-2.0', repo: 'https://github.com/ReactiveX/rxjs' },
    
    // Common utilities
    'lodash': { license: 'MIT', repo: 'https://github.com/lodash/lodash' },
    'moment': { license: 'MIT', repo: 'https://github.com/moment/moment' },
    'luxon': { license: 'MIT', repo: 'https://github.com/moment/luxon' },
    'date-fns': { license: 'MIT', repo: 'https://github.com/date-fns/date-fns' },
    'ramda': { license: 'MIT', repo: 'https://github.com/ramda/ramda' },
    'uuid': { license: 'MIT', repo: 'https://github.com/uuidjs/uuid' },
    'd3': { license: 'ISC', repo: 'https://github.com/d3/d3' },
    
    // TypeScript
    'typescript': { license: 'Apache-2.0', repo: 'https://github.com/microsoft/TypeScript' },
    'tslib': { license: '0BSD', repo: 'https://github.com/Microsoft/tslib' },
  };
  
  if (knownLicenses[packageName]) {
    return knownLicenses[packageName];
  }
  
  // Generate npm registry URL
  const npmUrl = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;
  
  // Default to MIT for most npm packages (common), actual license will be fetched dynamically
  return {
    license: 'See package',
    repo: `https://www.npmjs.com/package/${packageName}`,
    npmUrl: npmUrl
  };
}

// Generate the license data
function generateLicenseData() {
  const packages = parseYarnLock();
  markDirectDependencies(packages);
  
  const licenseData = [];
  
  for (const [name, info] of packages.entries()) {
    const licenseInfo = getLicenseInfo(name);
    
    licenseData.push({
      name: name,
      version: info.version,
      license: licenseInfo.license,
      repository: licenseInfo.repo,
      npmUrl: licenseInfo.npmUrl,
      isDirect: info.isDirect,
      licenseUrl: licenseInfo.repo ? `${licenseInfo.repo.replace('github.com', 'raw.githubusercontent.com')}/main/LICENSE` : null
    });
  }
  
  // Sort by name
  licenseData.sort((a, b) => a.name.localeCompare(b.name));
  
  return {
    generated: new Date().toISOString(),
    totalPackages: licenseData.length,
    directPackages: licenseData.filter(p => p.isDirect).length,
    packages: licenseData
  };
}

// Main execution
try {
  console.log('Generating license data from yarn.lock...');
  const licenseData = generateLicenseData();
  
  const outputPath = path.join('src', 'assets', 'licenses.json');
  fs.writeFileSync(outputPath, JSON.stringify(licenseData, null, 2));
  
  console.log(`✓ Generated ${licenseData.totalPackages} package licenses`);
  console.log(`  - Direct dependencies: ${licenseData.directPackages}`);
  console.log(`  - Nested dependencies: ${licenseData.totalPackages - licenseData.directPackages}`);
  console.log(`✓ Saved to ${outputPath}`);
} catch (error) {
  console.error('Error generating license data:', error);
  process.exit(1);
}

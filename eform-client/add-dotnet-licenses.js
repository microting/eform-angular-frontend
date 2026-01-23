#!/usr/bin/env node

/**
 * Add .NET packages to the licenses.json file
 */

const fs = require('fs');
const path = require('path');

// Read the existing licenses.json
const licensesPath = path.join('src', 'assets', 'licenses.json');
const licensesData = JSON.parse(fs.readFileSync(licensesPath, 'utf8'));

// Read the .NET packages JSON
const dotnetPackagesPath = '/tmp/dotnet-packages.json';
const dotnetData = JSON.parse(fs.readFileSync(dotnetPackagesPath, 'utf8'));

// Map of known .NET package licenses
const knownDotnetLicenses = {
  'Microsoft.EntityFrameworkCore': { license: 'MIT', repo: 'https://github.com/dotnet/efcore' },
  'Microsoft.AspNetCore.Authentication.JwtBearer': { license: 'MIT', repo: 'https://github.com/dotnet/aspnetcore' },
  'Microsoft.AspNetCore.Identity.UI': { license: 'MIT', repo: 'https://github.com/dotnet/aspnetcore' },
  'Microsoft.AspNetCore.Identity.EntityFrameworkCore': { license: 'MIT', repo: 'https://github.com/dotnet/aspnetcore' },
  'Swashbuckle.AspNetCore': { license: 'MIT', repo: 'https://github.com/domaindrivendev/Swashbuckle.AspNetCore' },
  'Sentry': { license: 'MIT', repo: 'https://github.com/getsentry/sentry-dotnet' },
  'sendgrid': { license: 'MIT', repo: 'https://github.com/sendgrid/sendgrid-csharp' },
  'Newtonsoft.Json': { license: 'MIT', repo: 'https://github.com/JamesNK/Newtonsoft.Json' },
  'Castle.Core': { license: 'Apache-2.0', repo: 'https://github.com/castleproject/Core' },
  'Castle.Windsor': { license: 'Apache-2.0', repo: 'https://github.com/castleproject/Windsor' },
};

function getLicenseInfo(packageName) {
  if (knownDotnetLicenses[packageName]) {
    const info = knownDotnetLicenses[packageName];
    return {
      license: info.license,
      repository: info.repo,
      licenseUrl: `${info.repo.replace('github.com', 'raw.githubusercontent.com')}/main/LICENSE`
    };
  }
  
  // Default
  return {
    license: 'See package',
    repository: `https://www.nuget.org/packages/${packageName}`,
    licenseUrl: null
  };
}

// Process all .NET projects
const dotnetPackages = [];
const processedPackages = new Set();

for (const project of dotnetData.projects) {
  for (const framework of project.frameworks) {
    // Add top-level packages
    for (const pkg of framework.topLevelPackages || []) {
      if (!processedPackages.has(pkg.id)) {
        processedPackages.add(pkg.id);
        const licenseInfo = getLicenseInfo(pkg.id);
        dotnetPackages.push({
          name: pkg.id,
          version: pkg.resolvedVersion,
          license: licenseInfo.license,
          repository: licenseInfo.repository,
          isDirect: true,
          isNuGet: true,
          licenseUrl: licenseInfo.licenseUrl
        });
      }
    }
    
    // Add transitive packages
    for (const pkg of framework.transitivePackages || []) {
      if (!processedPackages.has(pkg.id)) {
        processedPackages.add(pkg.id);
        const licenseInfo = getLicenseInfo(pkg.id);
        dotnetPackages.push({
          name: pkg.id,
          version: pkg.resolvedVersion,
          license: licenseInfo.license,
          repository: licenseInfo.repository,
          isDirect: false,
          isNuGet: true,
          licenseUrl: licenseInfo.licenseUrl
        });
      }
    }
  }
}

// Add .NET packages to the existing data
licensesData.packages.push(...dotnetPackages);
licensesData.totalPackages += dotnetPackages.length;
licensesData.directPackages += dotnetPackages.filter(p => p.isDirect).length;
licensesData.nugetPackages = dotnetPackages.length;

// Re-sort by name
licensesData.packages.sort((a, b) => a.name.localeCompare(b.name));

// Save updated file
fs.writeFileSync(licensesPath, JSON.stringify(licensesData, null, 2));

console.log(`✓ Added ${dotnetPackages.length} .NET packages`);
console.log(`  - Direct NuGet packages: ${dotnetPackages.filter(p => p.isDirect).length}`);
console.log(`  - Nested NuGet packages: ${dotnetPackages.filter(p => !p.isDirect).length}`);
console.log(`✓ Total packages now: ${licensesData.totalPackages}`);

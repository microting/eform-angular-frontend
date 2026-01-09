# Open Source Licenses Generation

This directory contains scripts to generate a comprehensive list of all open source dependencies (including nested/transitive dependencies) used in this project.

## Scripts

### `generate-licenses.js`
Extracts all npm packages and their versions from `yarn.lock`, including:
- Direct dependencies from `package.json`
- All transitive (nested) dependencies

Outputs to: `src/assets/licenses.json`

### `add-dotnet-licenses.js`
Extracts all NuGet packages from the .NET projects, including:
- Top-level packages from `.csproj` files
- All transitive dependencies

Appends to: `src/assets/licenses.json`

## Usage

To regenerate the licenses file (run from `eform-client` directory):

```bash
# Step 1: Generate npm packages from yarn.lock
node generate-licenses.js

# Step 2: Generate .NET packages and add to the file
# First, generate the dotnet packages JSON
cd ../eFormAPI
dotnet list package --include-transitive --format json > /tmp/dotnet-packages.json

# Then add them to licenses.json
cd ../eform-client
node add-dotnet-licenses.js
```

Or use the npm script:
```bash
yarn generate-licenses
```

## Output Format

The `licenses.json` file contains:
```json
{
  "generated": "ISO timestamp",
  "totalPackages": 1667,
  "directPackages": 128,
  "nugetPackages": 134,
  "packages": [
    {
      "name": "package-name",
      "version": "1.0.0",
      "license": "MIT",
      "repository": "https://github.com/...",
      "licenseUrl": "https://raw.githubusercontent.com/.../LICENSE",
      "isDirect": true,
      "isNuGet": false
    }
  ]
}
```

## When to Regenerate

Regenerate the licenses file whenever:
- `package.json` dependencies are updated
- `yarn.lock` is modified (after `yarn install`)
- `.csproj` files are modified with new NuGet packages
- After dependency updates

## Notes

- The license information for known packages (Angular, RxJS, etc.) is hardcoded in the scripts
- For unknown packages, the license defaults to "See package" with a link to npm/NuGet
- License text is fetched on-demand from GitHub when users expand a package in the UI
- The generated file is committed to the repository for production builds

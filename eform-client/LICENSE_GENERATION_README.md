# Open Source Licenses Generation

This directory contains a Python script to generate a comprehensive list of all open source dependencies (including nested/transitive dependencies) used in this project.

## Scripts

### `generate-licenses.py` (Recommended)
A unified Python script that:
- Extracts all npm packages and their versions from `yarn.lock`
- Identifies direct dependencies from `package.json`
- Queries npm registry API to get actual GitHub repository URLs
- Extracts all NuGet packages from .NET projects
- Queries NuGet API to get actual GitHub repository URLs
- Constructs proper license URLs pointing to GitHub LICENSE files
- Generates a single consolidated `src/assets/licenses.json` file

**Requirements:**
- Python 3.6 or higher
- `requests` library (install via `pip install -r requirements.txt`)
- .NET SDK (for C# dependency extraction)

### Legacy Node.js Scripts (Deprecated)

#### `generate-licenses.js`
Old Node.js script that extracts npm packages from `yarn.lock`.

#### `add-dotnet-licenses.js`
Old Node.js script that adds .NET packages to licenses.json.

These scripts are kept for backward compatibility but the Python script is recommended.

## Usage

To regenerate the licenses file (run from `eform-client` directory):

### Using Python Script (Recommended)

```bash
# Install Python dependencies (first time only)
pip install -r requirements.txt

# Run the script
python3 generate-licenses.py
```

Or if you have Python configured as `python`:
```bash
python generate-licenses.py
```

### Using Legacy Node.js Scripts

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
      "isNuGet": false,
      "npmUrl": "https://registry.npmjs.org/package-name"
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

## How It Works

### Python Script (generate-licenses.py)

1. **npm Package Processing:**
   - Parses `yarn.lock` to extract all package names and versions
   - Identifies direct vs transitive dependencies from `package.json`
   - Queries npm registry API for each package to get:
     - License type
     - Repository URL (GitHub preferred)
   - Constructs LICENSE file URL from GitHub repository

2. **.NET Package Processing:**
   - Runs `dotnet list package --include-transitive --format json`
   - Parses output to get all NuGet packages (direct and transitive)
   - Queries NuGet API for each package to get:
     - License expression or license URL
     - Project/repository URL (GitHub preferred)
   - Constructs LICENSE file URL from GitHub repository

3. **License URL Construction:**
   - For GitHub repositories, converts `github.com` URLs to `raw.githubusercontent.com`
   - Attempts to point to `main/LICENSE` file
   - Handles various repository URL formats (git://, git+https://, etc.)

4. **Output Generation:**
   - Combines npm and NuGet packages
   - Sorts alphabetically by package name
   - Writes consolidated JSON file

## Notes

- The Python script queries live npm and NuGet APIs to get accurate, up-to-date license information
- License text is fetched on-demand from GitHub when users expand a package in the UI (avoids CORS issues)
- The C# backend controller (`LicensesController.cs`) proxies license text fetching to avoid CORS
- The generated file is committed to the repository for production builds
- Processing time: approximately 2-5 minutes depending on number of packages and API response times

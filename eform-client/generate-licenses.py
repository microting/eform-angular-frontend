#!/usr/bin/env python3
"""
License Generation Script

This script generates a comprehensive list of all dependencies (including transitive)
from both yarn.lock (npm packages) and .NET projects (NuGet packages).

Output: src/assets/licenses.json

Usage:
    python3 generate-licenses.py

Requirements:
    - Python 3.6+
    - requests library (pip install requests)
    - dotnet CLI (for C# dependencies)
"""

import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Set, Optional, Tuple
from datetime import datetime
import urllib.parse
import time

try:
    import requests
except ImportError:
    print("Error: 'requests' library not found.")
    print("Please install it using: pip install requests")
    sys.exit(1)


class LicenseGenerator:
    """Generate license information for npm and NuGet packages"""
    
    def __init__(self):
        self.packages: List[Dict] = []
        self.processed_packages: Set[str] = set()
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'eForm-License-Generator/1.0'
        })
        
    def parse_yarn_lock(self, yarn_lock_path: Path) -> Dict[str, Dict]:
        """Parse yarn.lock file to extract package names and versions"""
        print("Parsing yarn.lock...")
        
        packages = {}
        current_package = None
        current_version = None
        
        with open(yarn_lock_path, 'r', encoding='utf-8') as f:
            for line in f:
                # Package declaration line (starts with package name)
                if line and not line.startswith(' ') and not line.startswith('#') and '@' in line:
                    # Extract package name (handle scoped packages)
                    match = re.match(r'^"?(@?[^@\s]+)@[^"]*"?:', line)
                    if match:
                        current_package = match.group(1)
                        current_version = None
                
                # Version line
                elif line.strip().startswith('version ') and current_package:
                    version_match = re.search(r'version\s+"([^"]+)"', line)
                    if version_match:
                        current_version = version_match.group(1)
                        if current_package not in packages:
                            packages[current_package] = {
                                'name': current_package,
                                'version': current_version,
                                'isDirect': False
                            }
        
        print(f"  Found {len(packages)} packages in yarn.lock")
        return packages
    
    def mark_direct_dependencies(self, packages: Dict[str, Dict], package_json_path: Path):
        """Mark which packages are direct dependencies"""
        print("Identifying direct dependencies...")
        
        with open(package_json_path, 'r', encoding='utf-8') as f:
            package_json = json.load(f)
        
        direct_deps = set()
        if 'dependencies' in package_json:
            direct_deps.update(package_json['dependencies'].keys())
        if 'devDependencies' in package_json:
            direct_deps.update(package_json['devDependencies'].keys())
        
        direct_count = 0
        for name, info in packages.items():
            if name in direct_deps:
                info['isDirect'] = True
                direct_count += 1
        
        print(f"  Marked {direct_count} direct dependencies")
    
    def get_npm_package_info(self, package_name: str) -> Optional[Dict]:
        """Fetch package information from npm registry"""
        encoded_name = urllib.parse.quote(package_name, safe='')
        url = f"https://registry.npmjs.org/{encoded_name}"
        
        try:
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                return response.json()
        except Exception as e:
            print(f"  Warning: Could not fetch npm info for {package_name}: {e}")
        
        return None
    
    def extract_github_url(self, repo_url: str) -> Optional[str]:
        """Extract clean GitHub repository URL from various formats"""
        if not repo_url:
            return None
        
        # Handle git+https://github.com/user/repo.git
        # Handle git://github.com/user/repo.git
        # Handle https://github.com/user/repo
        # Handle github:user/repo
        
        patterns = [
            r'github\.com[:/]([^/]+)/([^/\s\.]+)',
            r'github:([^/]+)/([^/\s]+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, repo_url)
            if match:
                user, repo = match.groups()
                # Remove .git suffix if present
                repo = repo.replace('.git', '')
                return f"https://github.com/{user}/{repo}"
        
        return None
    
    def get_npm_license_info(self, package_name: str, version: str) -> Dict:
        """Get license information for an npm package"""
        npm_info = self.get_npm_package_info(package_name)
        
        license_type = "See package"
        repo_url = None
        license_url = None
        
        if npm_info:
            # Get license
            if 'license' in npm_info:
                if isinstance(npm_info['license'], str):
                    license_type = npm_info['license']
                elif isinstance(npm_info['license'], dict) and 'type' in npm_info['license']:
                    license_type = npm_info['license']['type']
            
            # Get repository URL
            if 'repository' in npm_info:
                repo_data = npm_info['repository']
                if isinstance(repo_data, str):
                    repo_url = self.extract_github_url(repo_data)
                elif isinstance(repo_data, dict) and 'url' in repo_data:
                    repo_url = self.extract_github_url(repo_data['url'])
            
            # Construct license URL if we have a GitHub repo
            if repo_url and 'github.com' in repo_url:
                # Convert github.com URL to raw.githubusercontent.com URL
                license_url = repo_url.replace('github.com', 'raw.githubusercontent.com') + '/main/LICENSE'
        
        # Default repository URL if we don't have a GitHub one
        if not repo_url:
            repo_url = f"https://www.npmjs.com/package/{package_name}"
        
        return {
            'license': license_type,
            'repository': repo_url,
            'licenseUrl': license_url,
            'npmUrl': f"https://registry.npmjs.org/{urllib.parse.quote(package_name, safe='')}"
        }
    
    def process_npm_packages(self, yarn_lock_path: Path, package_json_path: Path):
        """Process all npm packages from yarn.lock"""
        print("\n=== Processing npm packages ===")
        
        packages = self.parse_yarn_lock(yarn_lock_path)
        self.mark_direct_dependencies(packages, package_json_path)
        
        print(f"Fetching license information for {len(packages)} npm packages...")
        print("(This may take a few minutes)")
        
        count = 0
        for name, info in packages.items():
            count += 1
            if count % 50 == 0:
                print(f"  Progress: {count}/{len(packages)} packages processed...")
            
            # Get license info from npm registry
            license_info = self.get_npm_license_info(name, info['version'])
            
            package_data = {
                'name': name,
                'version': info['version'],
                'license': license_info['license'],
                'repository': license_info['repository'],
                'isDirect': info['isDirect'],
                'isNuGet': False,
                'licenseUrl': license_info['licenseUrl'],
                'npmUrl': license_info['npmUrl']
            }
            
            self.packages.append(package_data)
            self.processed_packages.add(name)
            
            # Small delay to avoid rate limiting
            if count % 100 == 0:
                time.sleep(1)
        
        print(f"✓ Processed {len(packages)} npm packages")
    
    def get_dotnet_packages(self, dotnet_project_dir: Path) -> List[Dict]:
        """Get .NET packages using dotnet list package command"""
        print("\n=== Processing .NET packages ===")
        print("Running dotnet list package...")
        
        try:
            # Run dotnet list package command
            result = subprocess.run(
                ['dotnet', 'list', 'package', '--include-transitive', '--format', 'json'],
                cwd=str(dotnet_project_dir),
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode != 0:
                print(f"  Warning: dotnet command failed: {result.stderr}")
                return []
            
            data = json.loads(result.stdout)
            return data.get('projects', [])
            
        except subprocess.TimeoutExpired:
            print("  Error: dotnet command timed out")
            return []
        except FileNotFoundError:
            print("  Error: dotnet CLI not found. Please install .NET SDK")
            return []
        except json.JSONDecodeError as e:
            print(f"  Error: Failed to parse dotnet output: {e}")
            return []
        except Exception as e:
            print(f"  Error: {e}")
            return []
    
    def get_nuget_package_info(self, package_name: str) -> Optional[Dict]:
        """Fetch package information from NuGet API"""
        url = f"https://api.nuget.org/v3/registration5-semver1/{package_name.lower()}/index.json"
        
        try:
            response = self.session.get(url, timeout=10)
            if response.status_code == 200:
                return response.json()
        except Exception as e:
            print(f"  Warning: Could not fetch NuGet info for {package_name}: {e}")
        
        return None
    
    def get_nuget_license_info(self, package_name: str, version: str) -> Dict:
        """Get license information for a NuGet package"""
        nuget_info = self.get_nuget_package_info(package_name)
        
        license_type = "See package"
        repo_url = None
        license_url = None
        
        if nuget_info and 'items' in nuget_info:
            # NuGet API returns a complex structure - find the version catalog
            for item in nuget_info['items']:
                if 'items' in item:
                    for catalog_entry in item['items']:
                        if 'catalogEntry' in catalog_entry:
                            entry = catalog_entry['catalogEntry']
                            
                            # Get license
                            if 'licenseExpression' in entry:
                                license_type = entry['licenseExpression']
                            elif 'licenseUrl' in entry and entry['licenseUrl']:
                                # If it's a GitHub license URL, extract the license type
                                license_url = entry['licenseUrl']
                                if 'licenses/' in license_url:
                                    license_type = license_url.split('licenses/')[-1]
                            
                            # Get repository URL
                            if 'projectUrl' in entry:
                                project_url = entry['projectUrl']
                                if project_url and 'github.com' in project_url:
                                    repo_url = self.extract_github_url(project_url)
                                    if repo_url:
                                        license_url = repo_url.replace('github.com', 'raw.githubusercontent.com') + '/main/LICENSE'
                            
                            break
        
        # Default repository URL
        if not repo_url:
            repo_url = f"https://www.nuget.org/packages/{package_name}"
        
        return {
            'license': license_type,
            'repository': repo_url,
            'licenseUrl': license_url
        }
    
    def process_dotnet_packages(self, dotnet_project_dir: Path):
        """Process all .NET packages"""
        projects = self.get_dotnet_packages(dotnet_project_dir)
        
        if not projects:
            print("  No .NET packages found or dotnet command failed")
            return
        
        dotnet_packages = []
        
        for project in projects:
            for framework in project.get('frameworks', []):
                # Process top-level (direct) packages
                for pkg in framework.get('topLevelPackages', []):
                    pkg_id = pkg['id']
                    if pkg_id not in self.processed_packages:
                        self.processed_packages.add(pkg_id)
                        dotnet_packages.append({
                            'id': pkg_id,
                            'version': pkg['resolvedVersion'],
                            'isDirect': True
                        })
                
                # Process transitive packages
                for pkg in framework.get('transitivePackages', []):
                    pkg_id = pkg['id']
                    if pkg_id not in self.processed_packages:
                        self.processed_packages.add(pkg_id)
                        dotnet_packages.append({
                            'id': pkg_id,
                            'version': pkg['resolvedVersion'],
                            'isDirect': False
                        })
        
        print(f"Fetching license information for {len(dotnet_packages)} .NET packages...")
        
        count = 0
        for pkg in dotnet_packages:
            count += 1
            if count % 20 == 0:
                print(f"  Progress: {count}/{len(dotnet_packages)} packages processed...")
            
            license_info = self.get_nuget_license_info(pkg['id'], pkg['version'])
            
            package_data = {
                'name': pkg['id'],
                'version': pkg['version'],
                'license': license_info['license'],
                'repository': license_info['repository'],
                'isDirect': pkg['isDirect'],
                'isNuGet': True,
                'licenseUrl': license_info['licenseUrl']
            }
            
            self.packages.append(package_data)
            
            # Small delay to avoid rate limiting
            if count % 50 == 0:
                time.sleep(1)
        
        print(f"✓ Processed {len(dotnet_packages)} .NET packages")
    
    def generate_license_json(self, output_path: Path):
        """Generate the final licenses.json file"""
        print("\n=== Generating licenses.json ===")
        
        # Sort packages by name
        self.packages.sort(key=lambda p: p['name'].lower())
        
        direct_count = sum(1 for p in self.packages if p['isDirect'])
        nuget_count = sum(1 for p in self.packages if p['isNuGet'])
        npm_count = len(self.packages) - nuget_count
        
        license_data = {
            'generated': datetime.utcnow().isoformat() + 'Z',
            'totalPackages': len(self.packages),
            'directPackages': direct_count,
            'nugetPackages': nuget_count,
            'packages': self.packages
        }
        
        # Ensure output directory exists
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Write JSON file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(license_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n✓ Successfully generated licenses.json")
        print(f"  Total packages: {len(self.packages)}")
        print(f"  - npm packages: {npm_count}")
        print(f"  - NuGet packages: {nuget_count}")
        print(f"  Direct dependencies: {direct_count}")
        print(f"  Transitive dependencies: {len(self.packages) - direct_count}")
        print(f"  Output: {output_path}")


def main():
    """Main execution"""
    print("=" * 60)
    print("License Information Generator")
    print("=" * 60)
    
    # Determine paths
    script_dir = Path(__file__).parent
    yarn_lock = script_dir / 'yarn.lock'
    package_json = script_dir / 'package.json'
    output_path = script_dir / 'src' / 'assets' / 'licenses.json'
    dotnet_project_dir = script_dir.parent / 'eFormAPI'
    
    # Validate required files exist
    if not yarn_lock.exists():
        print(f"Error: yarn.lock not found at {yarn_lock}")
        sys.exit(1)
    
    if not package_json.exists():
        print(f"Error: package.json not found at {package_json}")
        sys.exit(1)
    
    if not dotnet_project_dir.exists():
        print(f"Warning: .NET project directory not found at {dotnet_project_dir}")
        print("Will only process npm packages")
    
    # Generate licenses
    generator = LicenseGenerator()
    
    try:
        # Process npm packages
        generator.process_npm_packages(yarn_lock, package_json)
        
        # Process .NET packages if directory exists
        if dotnet_project_dir.exists():
            generator.process_dotnet_packages(dotnet_project_dir)
        
        # Generate output file
        generator.generate_license_json(output_path)
        
        print("\n✓ License generation completed successfully!")
        
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()

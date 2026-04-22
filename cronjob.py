"""Automated NuGet dependency updater.

Discovers every `*.csproj` under the repo root (excluding `bin/`, `obj/`,
`node_modules/` and any `EXCLUDED_PATH_PREFIXES`), reads each one's inline
`<PackageReference ... Version="..."/>` entries, and atomically bumps every
reference to the latest stable (non-pre-release) NuGet version.

Pre-release versions (any version containing `-`, per SemVer) are never
installed. References currently pinned to a pre-release are left alone with a
printed warning — fixing those is a manual decision.

On success: one GitHub issue summarizing every bump, one commit staging every
modified csproj (never `git add .`), one patch-version tag, one push.

On `dotnet restore` failure: every modified csproj is rolled back via
`git checkout` and the script exits non-zero without creating an issue,
commit, or tag.
"""

import os
import re
import subprocess
import sys
from pathlib import Path
from xml.etree import ElementTree as ET

import requests

GITHUB_REPO_OWNER = "microting"
GITHUB_REPO_NAME = "eform-angular-frontend"

EXCLUDED_PATH_PREFIXES = ["eFormAPI/Plugins"]
EXCLUDED_DIR_NAMES = {"bin", "obj", "node_modules"}

REPO_ROOT = Path(__file__).resolve().parent
GITHUB_ACCESS_TOKEN = os.getenv("CHANGELOG_GITHUB_TOKEN")


def discover_csprojs():
    excluded_prefixes = tuple(p.rstrip("/") + "/" for p in EXCLUDED_PATH_PREFIXES)
    results = []
    for path in REPO_ROOT.rglob("*.csproj"):
        rel = path.relative_to(REPO_ROOT)
        if any(part in EXCLUDED_DIR_NAMES for part in rel.parts):
            continue
        rel_str = rel.as_posix()
        if rel_str.startswith(excluded_prefixes):
            continue
        results.append(path)
    return sorted(results)


def read_package_references(csproj_path):
    tree = ET.parse(csproj_path)
    refs = []
    for pr in tree.getroot().iter("PackageReference"):
        name = pr.attrib.get("Include")
        version = pr.attrib.get("Version")
        if name and version:
            refs.append((name, version))
    return refs


def get_latest_stable_version(package_name):
    url = f"https://api.nuget.org/v3-flatcontainer/{package_name.lower()}/index.json"
    response = requests.get(url, timeout=30)
    if response.status_code != 200:
        return None
    stable = [v for v in response.json().get("versions", []) if "-" not in v]
    return stable[-1] if stable else None


def update_csproj_versions(csproj_path, bumps):
    content = csproj_path.read_text(encoding="utf-8")
    for name, _old, new in bumps:
        pattern = re.compile(
            r'(<PackageReference\s+Include="'
            + re.escape(name)
            + r'"\s+Version=")[^"]+(")'
        )
        content, n = pattern.subn(r"\g<1>" + new + r"\g<2>", content)
        if n == 0:
            raise RuntimeError(
                f"No PackageReference with inline Version attribute found for "
                f"{name} in {csproj_path}"
            )
    csproj_path.write_text(content, encoding="utf-8")


def rollback(csproj_paths):
    if not csproj_paths:
        return
    rel_paths = [str(p.relative_to(REPO_ROOT)) for p in csproj_paths]
    subprocess.run(["git", "checkout", "--", *rel_paths], check=True)


def run_restore():
    slns = sorted(REPO_ROOT.glob("*.sln"))
    if slns:
        return subprocess.run(
            ["dotnet", "restore", str(slns[0])],
            capture_output=True,
            text=True,
        )
    last_failure = None
    for csproj in discover_csprojs():
        result = subprocess.run(
            ["dotnet", "restore", str(csproj)],
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            last_failure = result
    if last_failure is not None:
        return last_failure
    return subprocess.CompletedProcess(args=[], returncode=0, stdout="", stderr="")


def create_github_issue(bumps_by_csproj):
    total = sum(len(bs) for bs in bumps_by_csproj.values())
    plural = "s" if total != 1 else ""
    title = f"Bump {total} NuGet package{plural}"
    lines = ["The following packages were updated:", ""]
    for csproj_rel, bumps in bumps_by_csproj.items():
        lines.append(f"### `{csproj_rel}`")
        for name, old, new in bumps:
            lines.append(f"- `{name}`: {old} -> {new}")
        lines.append("")
    body = "\n".join(lines)

    headers = {
        "Authorization": f"Bearer {GITHUB_ACCESS_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
    }
    response = requests.post(
        f"https://api.github.com/repos/{GITHUB_REPO_OWNER}/{GITHUB_REPO_NAME}/issues",
        headers=headers,
        json={"title": title, "body": body},
    )
    if response.status_code != 201:
        raise RuntimeError(f"Failed to create GitHub issue: {response.text}")
    issue_number = response.json()["number"]
    print(f"GitHub issue '{title}' created. Issue Number: {issue_number}")

    for label in (".Net", "backend", "enhancement"):
        label_response = requests.post(
            f"https://api.github.com/repos/{GITHUB_REPO_OWNER}/{GITHUB_REPO_NAME}/issues/{issue_number}/labels",
            headers=headers,
            json={"labels": [label]},
        )
        if label_response.status_code == 200:
            print(f"Label '{label}' added to the issue.")
        else:
            print(f"Failed to add label '{label}' to the issue.")
    return issue_number


def commit_modified_csprojs(csproj_paths, issue_number):
    rel_paths = [str(p.relative_to(REPO_ROOT)) for p in csproj_paths]
    subprocess.run(["git", "add", *rel_paths], check=True)
    subprocess.run(["git", "commit", "-m", f"closes #{issue_number}"], check=True)


def push_new_version_tag():
    subprocess.run(["git", "fetch", "--tags"], check=True)
    tags_output = (
        subprocess.check_output(["git", "tag", "--sort=-v:refname"])
        .decode("utf-8")
        .strip()
    )
    if not tags_output:
        print("No tags found in the repository.")
        return
    major = minor = build = None
    for line in tags_output.splitlines():
        parts = line.lstrip("v").split(".")
        if len(parts) == 3 and all(p.isdigit() for p in parts):
            major, minor, build = map(int, parts)
            break
    if major is None:
        print("No semver-formatted tags found.")
        return
    new_tag = f"v{major}.{minor}.{build + 1}"
    print(f"Highest tag: v{major}.{minor}.{build}. Creating new tag {new_tag}.")
    subprocess.run(["git", "tag", new_tag], check=True)
    subprocess.run(["git", "push", "--tags"], check=True)
    subprocess.run(["git", "push"], check=True)


def main():
    commits_before = len(
        subprocess.check_output(["git", "log", "--oneline"])
        .decode("utf-8")
        .splitlines()
    )
    print("Current number of commits:", commits_before)

    csprojs = discover_csprojs()
    if not csprojs:
        print("No csproj files found in scope.")
        return
    print(f"Discovered {len(csprojs)} csproj(s) in scope:")
    for p in csprojs:
        print(f"  {p.relative_to(REPO_ROOT)}")

    latest_cache = {}
    pre_release_pins = []
    planned = {}

    for csproj in csprojs:
        for name, current in read_package_references(csproj):
            if "-" in current:
                pre_release_pins.append((csproj, name, current))
                continue
            if name not in latest_cache:
                print(f"Checking {name}")
                latest_cache[name] = get_latest_stable_version(name)
            latest = latest_cache[name]
            if latest is None:
                print(f"Failed to retrieve package information for {name}.")
                continue
            if latest == current:
                continue
            planned.setdefault(csproj, []).append((name, current, latest))

    for csproj, name, version in pre_release_pins:
        rel = csproj.relative_to(REPO_ROOT)
        print(f"Skipping {name} in {rel}: pinned to pre-release ({version}).")

    if not planned:
        print("Nothing to do, everything is up to date.")
        return

    print()
    print("Planned bumps:")
    for csproj, bumps in planned.items():
        rel = csproj.relative_to(REPO_ROOT)
        print(f"  {rel}")
        for name, old, new in bumps:
            print(f"    {name}: {old} -> {new}")

    modified = []
    try:
        for csproj, bumps in planned.items():
            update_csproj_versions(csproj, bumps)
            modified.append(csproj)
    except Exception:
        rollback(modified)
        raise

    restore = run_restore()
    if restore.returncode != 0:
        print("dotnet restore failed after applying bumps. Rolling back.")
        print(restore.stdout)
        print(restore.stderr, file=sys.stderr)
        rollback(modified)
        sys.exit(1)

    bumps_by_csproj_rel = {
        str(csproj.relative_to(REPO_ROOT)): bumps
        for csproj, bumps in planned.items()
    }
    issue_number = create_github_issue(bumps_by_csproj_rel)
    commit_modified_csprojs(modified, issue_number)
    push_new_version_tag()


if __name__ == "__main__":
    main()

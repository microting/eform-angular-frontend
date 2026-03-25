import os
import subprocess
import re
import requests
import json

def run_command(command, shell=False, capture_output=False):
    return subprocess.run(command, shell=shell, check=True, capture_output=capture_output, text=True).stdout.strip()

def get_git_status():
    return run_command("git status | grep 'nothing to commit, working tree clean' | wc -l", shell=True, capture_output=True)

def get_commit_count():
    return int(run_command("git log --oneline | wc -l", shell=True, capture_output=True))

def get_package_version(package_name, project_name):
    output = run_command(f"dotnet list {project_name} package | grep '{package_name} '", shell=True)
    match = re.search(r'(\d+\.\d+\.\d+)', output)
    return match.group(0) if match else None

def bump_package_version(project_name, package_name, old_version, new_version, repository):
    issue_data = {
        "title": f"Bump {package_name} from {old_version} to {new_version}",
        "body": "TBD",
        "assignees": ["renemadsen"],
        "labels": [".NET", "backend", "enhancement"]
    }

    headers = {
        "Authorization": f"token {os.getenv('CHANGELOG_GITHUB_TOKEN')}",
        "Content-Type": "application/json"
    }

    response = requests.post(
        f"https://api.github.com/repos/microting/{repository}/issues",
        headers=headers,
        data=json.dumps(issue_data)
    )

    issue_number = response.json().get("number")
    run_command(["git", "add", "."])
    run_command(["git", "commit", "-a", "-m", f"closes #{issue_number}"])

def get_git_version():
    return run_command("git tag --sort=-creatordate | head -n 1", shell=True).replace('v', '')

def update_git_version():
    current_version = get_git_version()
    major, minor, build = map(int, current_version.split('.'))
    new_version = f"v{major}.{minor}.{build + 1}"
    run_command(["git", "tag", new_version])
    run_command(["git", "push", "--tags"])
    run_command(["git", "push"])
    return new_version

def process_repository(project_name, packages, repository):
    for package_name in packages:
        old_version = get_package_version(package_name, project_name)
        run_command(["dotnet", "add", project_name, "package", package_name])
        new_version = get_package_version(package_name, project_name)

        if new_version and new_version != old_version:
            bump_package_version(project_name, package_name, old_version, new_version, repository)

def main():
    os.chdir(os.path.expanduser("~"))

    if int(get_git_status()) > 0:
        run_command("git checkout master", shell=True)
        run_command("git pull", shell=True)
        current_number_of_commits = get_commit_count()

        os.chdir("eFormAPI/eFormAPI.Web")
        packages = [
            'Microting.eForm', 'Microting.eFormApi.BasePn', 'Microting.EformAngularFrontendBase',
            'Microsoft.AspNetCore.Identity.UI', 'Microsoft.AspNetCore.Authentication.JwtBearer',
            'Microsoft.AspNetCore.Mvc.NewtonsoftJson', 'Microsoft.EntityFrameworkCore.InMemory',
            'System.Configuration.ConfigurationManager', 'Sentry'
        ]
        process_repository('eFormAPI.Web.csproj', packages, 'eform-angular-frontend')

        os.chdir("..")
        os.chdir("eFormAPI.Web.Tests")
        packages = [
            'Microsoft.NET.Test.Sdk', 'NUnit', 'NUnit3TestAdapter', 'NUnit.Analyzers'
        ]
        process_repository('eFormAPI.Web.Tests.csproj', packages, 'eform-angular-frontend')

        os.chdir("..")
        os.chdir("eFormAPI.Web.Integration.Tests")
        packages = [
            'Microsoft.NET.Test.Sdk', 'NUnit', 'NUnit3TestAdapter', 'NUnit.Analyzers'
        ]
        process_repository('eFormAPI.Web.Integration.Tests.csproj', packages, 'eform-angular-frontend')

        new_number_of_commits = get_commit_count()
        if new_number_of_commits > current_number_of_commits:
            new_version = update_git_version()
            print(f"Updated Microting eForm and pushed new version {new_version}")
            os.chdir(os.path.join("..", ".."))
            run_command(f"github_changelog_generator -u microting -p eform-angular-frontend -t {os.getenv('CHANGELOG_GITHUB_TOKEN')}", shell=True)
            run_command(["git", "add", "CHANGELOG.md"])
            run_command(["git", "commit", "-m", "Updating changelog"])
            run_command(["git", "push"])
        else:
            print("Nothing to do, everything is up to date.")
    else:
        print("Working tree is not clean, so we are not going to upgrade. Clean before doing upgrade!")

if __name__ == "__main__":
    main()

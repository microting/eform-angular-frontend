#!/bin/bash

GIT_STATUS=`git status | grep "nothing to commit, working tree clean" | wc -l`
if (( "$GIT_STATUS" > 0 )); then
	git pull
	cd eFormAPI/eFormAPI.Web
  CURRENT_NUMBER_OF_COMMITS=`git rev-list --all --count`

	PACKAGES=('Microting.eForm' 'Microting.eFormApi.BasePn' 'AWSSDK.Core' 'AWSSDK.S3' 'Pomelo.EntityFrameworkCore.MySql')
	PROJECT_NAME='eFormAPI.Web.csproj'
	REPOSITORY='eform-angular-frontend'

	for PACKAGE_NAME in ${PACKAGES[@]}; do

		OLD_VERSION=`dotnet list package | grep "$PACKAGE_NAME " | grep -oP '\s\d.\d..\d\s' | grep -oP '\d.\d..\d' | sed -n 1p`
		BOLD_VERSION=${OLD_VERSION//\./}

		dotnet add $PROJECT_NAME package $PACKAGE_NAME

		NEW_VERSION=`dotnet list package | grep "$PACKAGE_NAME " | grep -oP '\s\d.\d..\d\s' | grep -oP '\d.\d..\d' | sed -n 1p`
		BNEW_VERSION=${NEW_VERSION//\./}

		if (( $BNEW_VERSION > $BOLD_VERSION)); then
		  echo "We have a new version of $PACKAGE_NAME, so creating github issue and do a commit message to close that said issue"
		  RESULT=`curl -X "POST" "https://api.github.com/repos/microting/$REPOSITORY/issues?state=all" \
		     -H "Cookie: logged_in=no" \
		     -H "Authorization: token $CHANGELOG_GITHUB_TOKEN" \
		     -H "Content-Type: text/plain; charset=utf-8" \
		     -d $'{
		  "title": "Bump '$PACKAGE_NAME' from '$OLD_VERSION' to '$NEW_VERSION'",
		  "body": "TBD",
		  "assignees": [
		    "renemadsen"
		  ],
		  "labels": [
		    ".NET",
		    "backend",
		    "enhancement"
		  ]
		}'`
		  ISSUE_NUMBER=`echo $RESULT | grep -oP 'number": \d..,' | grep -oP '\d..'`
		  git add .
		  git commit -a -m "closes #$ISSUE_NUMBER"
		fi
	done
	NEW_NUMBER_OF_COMMITS=`git rev-list --all --count`

	if (( $NEW_NUMBER_OF_COMMITS > $CURRENT_NUMBER_OF_COMMITS )); then
		echo "nothing to do, everything is up to date."
	else
		CURRENT_GITVERSION=`git tag --sort=-creatordate | cut -d "v" -f 2 | sed -n 1p`
		MAJOR_VERSION=`echo $CURRENT_GITVERSION | cut -d "." -f 1`
		MINOR_VERSION=`echo $CURRENT_GITVERSION | cut -d "." -f 2`
		BUILD_VERSION=`echo $CURRENT_GITVERSION | cut -d "." -f 3`
		BUILD_VERSION=$(($BUILD_VERSION + 1))
		NEW_GIT_VERSION="v$MAJOR_VERSION.$MINOR_VERSION.$BUILD_VERSION"
		git tag "$NEW_GIT_VERSION"
		git push --tags
		git push
		echo "Updated Microting eForm to ${EFORM_VERSION} and pushed new version ${NEW_GIT_VERSION}"
	fi
else
	echo "Working tree is not clean, so we are not going to upgrade. Clean, before doing upgrade!"
fi

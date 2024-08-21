#!/bin/bash

GIT_STATUS=`git status | grep "nothing to commit, working tree clean" | wc -l`
if (( "$GIT_STATUS" > 0 )); then
	git checkout master
	git pull
	cd eFormAPI/eFormAPI.Web
  CURRENT_NUMBER_OF_COMMITS=`git log --oneline | wc -l`

	PACKAGES=('Microting.eForm' 'Microting.eFormApi.BasePn' 'Microting.EformAngularFrontendBase' 'Microsoft.AspNetCore.Identity.UI' 'Microsoft.AspNetCore.Authentication.JwtBearer' 'Microsoft.AspNetCore.Mvc.NewtonsoftJson' 'Microsoft.EntityFrameworkCore.InMemory')
	#PACKAGES=('Microting.eForm' 'Microting.eFormApi.BasePn' 'Microting.EformAngularFrontendBase')
	PROJECT_NAME='eFormAPI.Web.csproj'
	REPOSITORY='eform-angular-frontend'

	for PACKAGE_NAME in ${PACKAGES[@]}; do

		OLD_VERSION=`dotnet list package | grep "$PACKAGE_NAME " | grep -oP ' \d\.\d+\.\d.*' | grep -oP ' \d.* \b' | xargs`

		dotnet add $PROJECT_NAME package $PACKAGE_NAME

		NEW_VERSION=`dotnet list package | grep "$PACKAGE_NAME " | grep -oP ' \d\.\d+\.\d.*$' | grep -oP '\d\.\d+\.\d.*$' | grep -oP ' \d\.\d+\.\d.*$' | xargs`

		if [ $NEW_VERSION != $OLD_VERSION ]; then
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
			ISSUE_NUMBER=`echo $RESULT | grep -oP 'number": \d+,' | grep -oP '\d+'`
		  git add .
		  git commit -a -m "closes #$ISSUE_NUMBER"
		fi
	done
	NEW_NUMBER_OF_COMMITS=`git log --oneline | wc -l`

	if (( $NEW_NUMBER_OF_COMMITS > $CURRENT_NUMBER_OF_COMMITS )); then
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
		cd ../..
		github_changelog_generator -u microting -p $REPOSITORY -t $CHANGELOG_GITHUB_TOKEN
		git add CHANGELOG.md
		git commit -m "Updating changelog"
		git push
	else
		echo "nothing to do, everything is up to date."
	fi
else
	echo "Working tree is not clean, so we are not going to upgrade. Clean, before doing upgrade!"
fi

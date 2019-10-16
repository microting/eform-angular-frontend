#!/bin/bash

GIT_STATUS=`git status | grep "nothing to commit, working tree clean" | wc -l`
if (( "$GIT_STATUS" > 0 )); then
	git pull
	cd eFormAPI/eFormAPI.Web

	dotnet add eFormAPI.Web.csproj package Microting.eForm
	dotnet add eFormAPI.Web.csproj package Microting.eFormApi.BasePn

	EFORM_VERSION=`dotnet list package | grep 'Microting.eForm ' | cut -c64-71`
	EFORM_BASEPN_VERSION=`dotnet list package | grep 'Microting.eFormApi.BasePn' | cut -c64-71`
	COMMIT_MESSAGE="Updating"$'\n'"- Microting.eForm to ${EFORM_VERSION}"$'\n'"- Microting.eFormApi.BasePn to ${EFORM_BASEPN_VERSION}"

	GIT_STATUS=`git status | grep "nothing to commit, working tree clean" | wc -l`

	if (( "$GIT_STATUS" > 0 )); then
		echo "nothing to do, everything is up to date."
	else
		git add .
		git commit -m "$COMMIT_MESSAGE"
		CURRENT_GITVERSION=`git describe --abbrev=0 --tags | cut -d "v" -f 2`
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

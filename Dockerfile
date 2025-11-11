FROM node:22-bookworm-slim as node-env

WORKDIR /app
ARG SENTRY_AUTH_TOKEN
ARG DISABLE_SENTRY
ENV PATH /app/node_modules/.bin:$PATH
COPY eform-client ./
RUN apt-get update
RUN apt-get -y -q install ca-certificates
RUN yarn install
RUN yarn build
RUN if [ -n "$SENTRY_AUTH_TOKEN" ] && [ "$DISABLE_SENTRY" != "true" ]; then yarn sentrysourcemap; else echo "Sentry sourcemap upload skipped (DISABLE_SENTRY=$DISABLE_SENTRY)"; fi

FROM mcr.microsoft.com/dotnet/sdk:9.0-noble AS build-env
WORKDIR /app
ARG GITVERSION
ARG DISABLE_SENTRY

# Copy csproj and restore as distinct layers
COPY eFormAPI/eFormAPI.Web ./
RUN dotnet publish -o out /p:Version=$GITVERSION --runtime linux-x64 --configuration Release
RUN pwd

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0-noble
WORKDIR /app
ARG DISABLE_SENTRY
ENV DISABLE_SENTRY=${DISABLE_SENTRY}
COPY --from=build-env /app/out .
COPY --from=node-env /app/dist/browser wwwroot
RUN rm connection.json; exit 0

ENTRYPOINT ["dotnet", "eFormAPI.Web.dll"]

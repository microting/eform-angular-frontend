FROM node:18-bookworm-slim as node-env
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY eform-client ./
RUN apt-get update
RUN apt-get -y -q install ca-certificates
RUN yarn install
RUN yarn build

FROM mcr.microsoft.com/dotnet/sdk:7.0-bookworm-slim AS build-env
WORKDIR /app
ARG GITVERSION

# Copy csproj and restore as distinct layers
COPY eFormAPI/eFormAPI.Web ./
RUN dotnet publish -o out /p:Version=$GITVERSION --runtime linux-x64 --configuration Release
RUN pwd

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0-bookworm-slim
WORKDIR /app
COPY --from=build-env /app/out .
COPY --from=node-env /app/dist wwwroot
RUN rm connection.json; exit 0

ENTRYPOINT ["dotnet", "eFormAPI.Web.dll"]

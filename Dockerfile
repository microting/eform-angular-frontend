FROM node:12.16.2 as node-env
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY eform-client ./
RUN npm install
RUN npm run build
RUN ls -lah

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app
RUN ls -lah

# Copy csproj and restore as distinct layers
COPY eFormAPI/eFormAPI.Web ./
RUN dotnet publish -c Release -o out
RUN ls -lah
RUN pwd

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app
RUN ls -lah
COPY --from=build-env /app/out .
RUN ls -lah
COPY --from=node-env /app/dist wwwroot
RUN rm connection.json

ENTRYPOINT ["dotnet", "eFormAPI.Web.dll"]

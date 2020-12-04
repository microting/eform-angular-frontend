FROM node:12.16.2 as node-env
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY eform-client ./
RUN npm install
RUN npm run build

FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY eFormAPI/eFormAPI.Web ./
RUN dotnet publish -c Release -o out

# Copy everything else and build
#WORKDIR /app/
#COPY . ./
#RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app
COPY --from=build-env /app/eFormAPI/eFormAPI.Web/out .
RUN ls -lah
RUN ls -lah out
RUN rm connection.json



ENTRYPOINT ["dotnet", "eFormAPI.Web.dll"]

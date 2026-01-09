# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Use a deterministic NuGet cache folder inside the image
ENV NUGET_PACKAGES=/root/.nuget/packages

# Copy solution + project files first (better caching)
COPY TriPowersLLC.sln ./
COPY server/*.csproj ./server/

# Restore
RUN dotnet restore ./server/TriPowersLLC.csproj

# Copy the rest of the source
COPY server/ ./server/
WORKDIR /src/server

# Publish (ALLOW restore; don't use --no-restore)
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://0.0.0.0:5169
EXPOSE 5169
ENTRYPOINT ["dotnet", "TriPowersLLC.dll"]


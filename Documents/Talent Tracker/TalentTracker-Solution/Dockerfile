# Use the official ASP.NET Core SDK image to build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy the solution file and project files
COPY *.sln ./
COPY src/TalentTracker.Core/*.csproj ./src/TalentTracker.Core/
COPY src/TalentTracker.Infrastructure/*.csproj ./src/TalentTracker.Infrastructure/
COPY src/TalentTracker.Service/*.csproj ./src/TalentTracker.Service/
COPY src/TalentTracker.API/*.csproj ./src/TalentTracker.API/

# Restore dependencies
RUN dotnet restore

# Copy the rest of the source code
COPY . .

# Build the API project
WORKDIR /app/src/TalentTracker.API
RUN dotnet publish -c Release -o /app/out

# Use the official ASP.NET Core Runtime image to run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

# Expose the port Render expects (usually 80 or via PORT env var)
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "TalentTracker.API.dll"]

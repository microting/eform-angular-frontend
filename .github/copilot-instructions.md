# GitHub Copilot Instructions for eForm Angular Frontend

## Repository Overview

This is **eForm Angular Frontend**, a multi-component application consisting of:
- **Angular Frontend** (`eform-client/`) - Angular-based UI
- **.NET Core Web API** (`eFormAPI/`) - Backend API using .NET 9.0
- **Docker Configuration** - Containerization setup
- **GitHub Actions** - CI/CD workflows

## Task Suitability for Copilot

### ✅ Well-Suited Tasks for Copilot
Copilot coding agent excels at:
- **Bug fixes** - Fixing identified issues with clear reproduction steps
- **UI improvements** - Making visual adjustments and accessibility enhancements
- **Test additions** - Adding unit tests, integration tests, or E2E tests
- **Documentation updates** - Updating README, API docs, or inline comments
- **Code refactoring** - Improving code quality while maintaining functionality
- **Dependency updates** - Updating package versions and fixing breaking changes
- **Translation updates** - Adding or updating localization files
- **Accessibility improvements** - Adding ARIA labels, keyboard navigation, etc.

### ❌ Tasks to Avoid Assigning to Copilot
Do not assign these complex tasks:
- **Architectural changes** - Major structural redesigns requiring deep domain knowledge
- **Business logic** - Critical business rules and decision-making code
- **Security implementations** - Authentication, authorization, encryption logic
- **Database migrations** - Complex schema changes affecting multiple systems
- **Performance optimizations** - System-wide performance improvements requiring profiling
- **Third-party integrations** - Initial setup of complex external service integrations

### 💡 Tips for Creating Good Issues for Copilot
- Provide clear, specific descriptions of the problem or feature
- Include acceptance criteria (e.g., "should have tests", "should update docs")
- Specify affected files or components when known
- Include examples or screenshots for UI changes
- Reference related issues or pull requests for context

## Prerequisites and Environment

### Required Software Versions
- **.NET 9.x** - **CRITICAL**: Project targets net9.0 framework
- **Node.js 22.19.x+** - Required for Angular build
- **yarn 1.22.19+** - Package manager (primary)

### Development Tools Verification
```bash
# Verify versions before starting development
dotnet --version  # Must be 9.x
node --version    # Should be 22.19.x+
yarn --version    # Should be 1.22.19+
```

### External Services (Required for Full Functionality)
- **MariaDB** - Primary database
- **RabbitMQ** - Message queue service

## Build Process - **NEVER CANCEL EARLY**

### .NET Core API Build (eFormAPI/)
```bash
cd eFormAPI

# Restore packages (25s initial, 1.3s cached) - DO NOT CANCEL
dotnet restore  # --timeout 300

# Build (12s) - DO NOT CANCEL
dotnet build    # --timeout 200
```

### Angular Frontend Build (eform-client/)
```bash
cd eform-client

# Install dependencies (37s) - NEVER CANCEL EARLY
yarn install     # --timeout 300

# Development build (20s)
yarn build       # --timeout 200

# Development server (35s to start)
yarn start       # --timeout 300
# Access at http://localhost:4200
```

## Development Workflow

### 1. Initial Repository Setup
```bash
# Clone and navigate
git clone <repo-url>
cd eform-angular-frontend

# Install all dependencies
cd eFormAPI && dotnet restore
cd ../eform-client && yarn install
```

### 2. Running Development Environment
```bash
# Terminal 1: Start .NET API
cd eFormAPI/eFormAPI.Web
dotnet run  # Starts API server

# Terminal 2: Start Angular dev server
cd eform-client
yarn start   # Starts on localhost:4200
```

### 3. Building for Production
```bash
# Build API
cd eFormAPI
dotnet build --configuration Release

# Build Angular
cd eform-client  
yarn build --prod
```

## Testing

### Unit Tests
```bash
# .NET API tests
cd eFormAPI
dotnet test  # --timeout 300

# Angular unit tests
cd eform-client
yarn test
```

### Integration Tests
```bash
# Requires MariaDB and RabbitMQ running
cd eFormAPI
dotnet test --filter "Category=Integration"  # --timeout 600
```

### End-to-End Tests
```bash
cd eform-client
yarn e2e  # --timeout 900

# Multiple E2E test configurations available:
yarn testheadless2a  # Step 2a tests
yarn testheadless2b  # Step 2b tests
# ... up to testheadless2j
```

## Network and CDN Workarounds

### Blocked CDN Solutions
If you encounter network blocks for external dependencies:

1. **ChromeDriver Issues**:
   ```bash
   # Use local ChromeDriver installation
   export CHROMEDRIVER_SKIP_DOWNLOAD=true
   ```

2. **Cypress Downloads**:
   ```bash
   # Set local cache
   export CYPRESS_CACHE_FOLDER=./cypress-cache
   ```

3. **xlsx Package Issues**:
   ```bash
   # Install with --force if needed
   yarn add xlsx --force
   ```

4. **Google Fonts Blocks**:
   - Use local font files instead of CDN links
   - Configure proxy for font downloads if needed

## Docker Development

### Running with Docker Compose
```bash
# Build and start all services
docker-compose up --build  # --timeout 900

# Start only specific services
docker-compose up api      # Start API only
docker-compose up frontend # Start frontend only
```

### Individual Docker Commands
```bash
# Build API container
docker build -t eform-api -f Dockerfile .  # --timeout 600

# Build frontend container  
docker build -t eform-frontend -f Dockerfile-big .  # --timeout 900
```

## Key Directories and Files

### Frontend Structure (eform-client/)
- `src/app/` - Angular application source
- `src/assets/` - Static assets
- `e2e/` - End-to-end tests
- `cypress/` - Cypress test configurations
- `angular.json` - Angular configuration
- `package.json` - Node.js dependencies

### Backend Structure (eFormAPI/)
- `eFormAPI.Web/` - Main web application
- `eFormAPI.Web.Tests/` - Unit tests
- `eFormAPI.Web.Integration.Tests/` - Integration tests
- `eFormAPI.sln` - Solution file

### Configuration Files
- `docker-compose.yml` - Docker services
- `Dockerfile` - API container configuration
- `Dockerfile-big` - Frontend container configuration
- `.github/workflows/` - CI/CD pipelines

## Troubleshooting Guide

### Common Build Issues

1. **.NET Version Mismatch**:
   ```bash
   # Ensure .NET 9.x is installed and active
   dotnet --version
   # If wrong version, install .NET 9.x SDK
   ```

2. **Node/yarn Version Issues**:
   ```bash
   # Check versions
   node --version  # Should be 22.19.x+
   yarn --version  # Should be 1.22.19+
   ```

3. **Package Restore Failures**:
   ```bash
   # Clear caches and reinstall
   cd eFormAPI && dotnet clean && dotnet restore
   cd eform-client && rm -rf node_modules && yarn install
   ```

4. **Test Database Connection**:
   - Ensure MariaDB is running and accessible
   - Check connection strings in configuration
   - Verify RabbitMQ service status

5. **Port Conflicts**:
   - API typically runs on port 5000/5001
   - Frontend runs on port 4200
   - Ensure ports are available

### Performance Optimization
- Use `yarn install --frozen-lockfile` instead of `yarn install` in CI/CD
- Enable .NET build caching with `--no-restore` after initial restore
- Use Docker layer caching for faster container builds

## CI/CD Integration

### GitHub Actions Workflows
Located in `.github/workflows/`:
- Build and test automation
- Multi-stage deployment pipelines
- Automated dependency updates

### Build Timeouts for CI/CD
Use these timeout values in your workflows:
- .NET restore: 300 seconds
- .NET build: 200 seconds  
- yarn install: 300 seconds
- Angular build: 200 seconds
- E2E tests: 900 seconds
- Integration tests: 600 seconds

## Architecture Notes

This is a **full-stack application** with separate frontend and backend components that work together. Always consider both sides when making changes:

- Frontend changes may require API updates
- Database schema changes affect both API and frontend
- Authentication/authorization spans both components
- Build processes are independent but coordinated

## Code Style and Conventions

### Angular Frontend (TypeScript)
- **Angular Style Guide**: Follow the [Official Angular Style Guide](https://angular.io/guide/styleguide)
- **Component Structure**: Use standalone components where appropriate
- **Naming Conventions**:
  - Components: `PascalCase` (e.g., `UserListComponent`)
  - Services: `PascalCase` with `Service` suffix (e.g., `UserService`)
  - Modules: `PascalCase` with `Module` suffix (e.g., `CoreModule`)
  - Files: `kebab-case` (e.g., `user-list.component.ts`)
- **TypeScript**: Use strict type checking, avoid `any` when possible
- **Imports**: Organize imports in order: Angular, third-party, local
- **RxJS**: Use the pipe operator, avoid nested subscribes
- **Translations**: Use translation keys from `src/assets/i18n/` files

### .NET Core API (C#)
- **Naming Conventions**: Follow Microsoft's C# conventions
  - PascalCase for public members, methods, classes
  - camelCase for private fields
  - Prefix interfaces with `I` (e.g., `IUserService`)
- **Async/Await**: Use async/await for all I/O operations
- **Dependency Injection**: Register services in `Program.cs`
- **API Controllers**: Use attribute routing, return ActionResult types
- **Error Handling**: Use try-catch blocks, return appropriate HTTP status codes
- **Testing**: Write unit tests for business logic, integration tests for API endpoints

### General Practices
- **Comments**: Write self-documenting code; add comments only for complex logic
- **Git Commits**: Use conventional commit format (feat:, fix:, docs:, etc.)
- **Pull Requests**: Keep PRs small and focused on a single issue
- **Code Reviews**: Address all review comments before merging

## Pull Request Workflow with Copilot

### Creating Pull Requests
- Copilot automatically creates PRs for assigned issues
- PR title follows format: `[Issue Type] Brief description`
- PR description includes implementation details and testing notes

### Iterating on Pull Requests
- **Provide feedback** by commenting on specific lines or the PR overall
- **Tag @copilot** in comments to request changes
- Be specific in feedback: "Please add error handling for null values"
- Copilot will update the PR based on your feedback

### Before Merging
- Ensure all CI/CD checks pass (build, tests, linting)
- Review code changes manually for logic errors
- Verify documentation updates are included if needed
- Confirm tests are added for new functionality

## Validation Guidelines for Copilot

When making changes, always:

1. **Run Linters**:
   ```bash
   # Frontend
   cd eform-client && yarn lint
   
   # Backend (if applicable linters exist)
   cd eFormAPI && dotnet format --verify-no-changes
   ```

2. **Build the Project**:
   ```bash
   # Build both frontend and backend
   cd eFormAPI && dotnet build
   cd ../eform-client && yarn build
   ```

3. **Run Tests**:
   ```bash
   # Run relevant tests for changed code
   cd eFormAPI && dotnet test
   cd ../eform-client && yarn test:unit
   ```

4. **Manual Verification**:
   - For UI changes: Start dev server and verify visually
   - For API changes: Test endpoints with sample requests
   - For bug fixes: Verify the original issue is resolved
   - For new features: Test happy path and edge cases

5. **Documentation**:
   - Update inline comments if logic is complex
   - Update README.md if user-facing changes exist
   - Update API documentation if endpoints change
   - Update translation files if UI text is added

## Security Considerations

- API endpoints require proper authentication
- Frontend implements role-based access control
- Sensitive configuration via environment variables
- Database connections use secure connection strings

---

**Important**: All build commands have been tested with actual execution times. The timeouts specified are based on real measurements plus buffer time. Never cancel long-running operations early - they are designed to complete successfully within the specified timeframes.
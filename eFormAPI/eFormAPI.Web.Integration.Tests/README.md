# Integration Tests for eFormAPI.Web

## Overview

This directory contains integration tests for the eFormAPI.Web application controllers and services. These tests are designed to prevent regressions when upgrading dependencies or making underlying infrastructure changes.

## Test Infrastructure

### Test Framework
- **NUnit 4.4.0** - Test framework
- **Moq 4.20.72** - Mocking framework
- **Microsoft.AspNetCore.Mvc.Testing 10.0.0** - ASP.NET Core testing utilities

### Base Test Fixture
All integration tests inherit from `DbTestFixture`, which provides:
- Database context setup and teardown
- Connection to test database (MariaDB/MySQL)
- Automatic database cleanup between tests

## Test Structure

### Services Tests
Located in `Services/` directory. Each service has a corresponding test file:

- **AccountServiceTests** - User account operations, settings, password management
- **AdminServiceTests** - Admin user management
- **UserServiceTests** - User CRUD operations and retrieval
- **SettingsServiceTests** - Application settings and configuration
- **TagsServiceTests** - Tag management operations
- **SitesServiceTests** - Site management
- **WorkersServiceTests** - Worker operations
- **UnitsServiceTests** - Unit management
- **FoldersServiceTests** - Folder operations
- **EntitySearchServiceTests** - Entity search functionality
- **EntitySelectServiceTests** - Entity selection
- **PluginsManagementServiceTests** - Plugin management

### Security Tests
Located in `Services/Security/` directory:
- Tests for security-related services
- Permission and authorization testing

## Running Tests

### Prerequisites
- .NET 10.0 SDK
- MariaDB/MySQL database server running on localhost:3306
- Database: `angular-tests`
- Credentials: user=root, password=secretpassword

### Commands

```bash
# Restore packages
dotnet restore

# Build solution
dotnet build

# Run all tests
dotnet test

# Run only integration tests
dotnet test eFormAPI.Web.Integration.Tests/eFormAPI.Web.Integration.Tests.csproj

# Run tests with verbose output
dotnet test --verbosity detailed
```

## Test Patterns

### Service Testing Pattern
```csharp
[TestFixture]
public class ExampleServiceTests : DbTestFixture
{
    private Mock<ILogger<ExampleService>> _logger;
    private Mock<IDependency> _dependency;
    private ExampleService _service;

    public override void DoSetup()
    {
        // Setup mocks
        _logger = new Mock<ILogger<ExampleService>>();
        _dependency = new Mock<IDependency>();
        
        // Create service with dependencies
        _service = new ExampleService(
            _logger.Object,
            _dependency.Object,
            DbContext);
    }

    [Test]
    public async Task MethodName_Scenario_ExpectedBehavior()
    {
        // Arrange
        // ... setup test data
        
        // Act
        var result = await _service.MethodName();
        
        // Assert
        Assert.That(result, Is.Not.Null);
    }
}
```

### Database Integration Tests
Tests that use `DbContext` can:
- Add entities to the database
- Query the database
- Test data persistence
- Validate business logic with real data

Example:
```csharp
[Test]
public async Task GetByIdAsync_WithValidId_ShouldReturnUser()
{
    // Arrange
    var user = new EformUser { Email = "test@example.com" };
    DbContext.Users.Add(user);
    await DbContext.SaveChangesAsync();

    // Act
    var result = await _service.GetByIdAsync(user.Id);

    // Assert
    Assert.That(result, Is.Not.Null);
    Assert.That(result.Email, Is.EqualTo(user.Email));
}
```

## Extending Test Coverage

### Adding New Service Tests
1. Create a new test file in `Services/` directory
2. Inherit from `DbTestFixture`
3. Mock dependencies in `DoSetup()` method
4. Write test methods following naming convention: `MethodName_Scenario_ExpectedBehavior`

### Adding Controller Tests
1. Create a new test file in `Controllers/` directory
2. Use `WebApplicationFactory<Program>` for full integration tests
3. Test HTTP endpoints with authentication

## CI/CD Integration

Integration tests are designed to run in CI/CD pipelines:
- Tests require MySQL database connection
- Database is automatically created and migrated
- All data is cleaned up between test runs
- Tests can run in parallel with proper database isolation

## Known Limitations

- Tests require external database (not in-memory)
- Some tests may require additional external services (RabbitMQ, eForm Core SDK)
- Full end-to-end tests may need complete application bootstrap

## Troubleshooting

### Database Connection Errors
If tests fail with MySQL connection errors:
1. Verify MySQL server is running
2. Check connection string in `DbTestFixture.cs`
3. Ensure database user has proper permissions
4. Create the test database if it doesn't exist

### Test Isolation Issues
If tests interfere with each other:
1. Verify `TearDown` properly cleans database
2. Check for static state in services
3. Ensure each test is independent

## Best Practices

1. **Test Independence** - Each test should be able to run independently
2. **Clear Arrange-Act-Assert** - Follow AAA pattern
3. **Descriptive Names** - Test names should clearly describe what is being tested
4. **Mock External Dependencies** - Mock APIs, file systems, external services
5. **Test Real Database Interactions** - Use real DbContext for data operations
6. **Cleanup** - Always cleanup test data in TearDown

## Contributing

When adding new integration tests:
1. Follow existing patterns and conventions
2. Ensure tests are meaningful and test actual integration points
3. Add documentation for complex test scenarios
4. Keep tests fast - avoid unnecessary delays or operations
5. Use meaningful assertion messages

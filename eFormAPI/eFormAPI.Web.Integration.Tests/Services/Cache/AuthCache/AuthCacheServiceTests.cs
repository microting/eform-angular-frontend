using eFormAPI.Web.Services.Cache.AuthCache;
using Microsoft.Extensions.Caching.Memory;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services.Cache.AuthCache;

[TestFixture]
public class AuthCacheServiceTests
{
#pragma warning disable NUnit1032
    private IMemoryCache _memoryCache;
#pragma warning restore NUnit1032
    private AuthCacheService _service;

    [SetUp]
    public void Setup()
    {
        _memoryCache = Substitute.For<IMemoryCache>();
        _service = new AuthCacheService(_memoryCache);
    }

    [Test]
    public void AuthCacheService_InitializesCorrectly()
    {
        // Assert
        Assert.That(_service, Is.Not.Null);
    }

    [Test]
    public void TryGetValue_WithNonExistentUserId_ReturnsNull()
    {
        // Arrange
        object outValue = null;
        _memoryCache.TryGetValue(Arg.Any<object>(), out outValue).Returns(false);

        // Act
        var result = _service.TryGetValue(999);

        // Assert
        Assert.That(result, Is.Null);
    }
}

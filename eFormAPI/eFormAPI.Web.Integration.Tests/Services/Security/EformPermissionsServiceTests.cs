using System.Threading.Tasks;
using eFormAPI.Web.Services.Security;
using Microting.eFormApi.BasePn.Abstractions;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services.Security;

[TestFixture]
public class EformPermissionsServiceTests : DbTestFixture
{
    private IUserService _userService;
    private EformPermissionsService _service;

    public override void DoSetup()
    {
        _userService = Substitute.For<IUserService>();
        
        _service = new EformPermissionsService(
            DbContext,
            _userService);
    }

    [Test]
    public void EformPermissionsService_InitializesCorrectly()
    {
        // Assert
        Assert.That(_service, Is.Not.Null);
    }

    [Test]
    public async Task CheckEform_AdminUser_ReturnsTrue()
    {
        // Arrange
        _userService.IsInRole(Arg.Any<string>()).Returns(true);
        _userService.UserId.Returns(1);

        // Act
        var result = await _service.CheckEform(1, "TestClaim");

        // Assert
        Assert.That(result, Is.True);
    }
}

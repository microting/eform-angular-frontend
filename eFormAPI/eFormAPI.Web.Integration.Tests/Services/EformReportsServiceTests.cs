using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Services;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services;

[TestFixture]
public class EformReportsServiceTests : DbTestFixture
{
    private IEFormCoreService _coreHelper;
    private IUserService _userService;
    private ILocalizationService _localizationService;
    private ILogger<EformReportsService> _logger;
    private EformReportsService _service;

    public override void DoSetup()
    {
        _coreHelper = Substitute.For<IEFormCoreService>();
        _userService = Substitute.For<IUserService>();
        _localizationService = Substitute.For<ILocalizationService>();
        _logger = Substitute.For<ILogger<EformReportsService>>();
        
        _service = new EformReportsService(
            _coreHelper,
            _userService,
            _localizationService,
            DbContext,
            _logger);
    }

    [Test]
    public void EformReportsService_InitializesCorrectly()
    {
        // Assert
        Assert.That(_service, Is.Not.Null);
    }
}

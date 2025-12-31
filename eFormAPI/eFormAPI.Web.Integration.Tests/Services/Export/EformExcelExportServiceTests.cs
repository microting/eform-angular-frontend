using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Services.Export;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services.Export;

[TestFixture]
public class EformExcelExportServiceTests : DbTestFixture
{
    private IEFormCoreService _coreHelper;
    private IUserService _userService;
    private ILocalizationService _localizationService;
    private ILogger<EformExcelExportService> _logger;
    private EformExcelExportService _service;

    public override void DoSetup()
    {
        _coreHelper = Substitute.For<IEFormCoreService>();
        _userService = Substitute.For<IUserService>();
        _localizationService = Substitute.For<ILocalizationService>();
        _logger = Substitute.For<ILogger<EformExcelExportService>>();
        
        _service = new EformExcelExportService(
            _coreHelper,
            _userService,
            _localizationService,
            _logger);
    }

    [Test]
    public void EformExcelExportService_InitializesCorrectly()
    {
        // Assert
        Assert.That(_service, Is.Not.Null);
    }
}

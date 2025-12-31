using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Services;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services;

[TestFixture]
public class EformCaseReportServiceTests : DbTestFixture
{
    private IEFormCoreService _coreHelper;
    private IUserService _userService;
    private ILocalizationService _localizationService;
    private ILogger<EformCaseReportService> _logger;
    private IWordService _wordService;
    private EformCaseReportService _service;

    public override void DoSetup()
    {
        _coreHelper = Substitute.For<IEFormCoreService>();
        _userService = Substitute.For<IUserService>();
        _localizationService = Substitute.For<ILocalizationService>();
        _logger = Substitute.For<ILogger<EformCaseReportService>>();
        _wordService = Substitute.For<IWordService>();
        
        _service = new EformCaseReportService(
            _coreHelper,
            _userService,
            _localizationService,
            _logger,
            _wordService);
    }

    [Test]
    public void EformCaseReportService_InitializesCorrectly()
    {
        // Assert
        Assert.That(_service, Is.Not.Null);
    }
}

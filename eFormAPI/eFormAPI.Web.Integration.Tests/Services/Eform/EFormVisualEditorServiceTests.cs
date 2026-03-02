using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Services.Eform;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services.Eform;

[TestFixture]
public class EFormVisualEditorServiceTests : DbTestFixture
{
    private IEFormCoreService _coreHelper;
    private ILogger<EFormVisualEditorService> _logger;
    private ILocalizationService _localizationService;
    private EFormVisualEditorService _service;

    public override void DoSetup()
    {
        _coreHelper = Substitute.For<IEFormCoreService>();
        _logger = Substitute.For<ILogger<EFormVisualEditorService>>();
        _localizationService = Substitute.For<ILocalizationService>();
        
        _service = new EFormVisualEditorService(
            _coreHelper,
            _logger,
            _localizationService);
    }

    [Test]
    public void EFormVisualEditorService_InitializesCorrectly()
    {
        // Assert
        Assert.That(_service, Is.Not.Null);
    }
}

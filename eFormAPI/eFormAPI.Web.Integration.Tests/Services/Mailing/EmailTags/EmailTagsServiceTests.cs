using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Services.Mailing.EmailTags;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using NSubstitute;
using NUnit.Framework;

namespace eFormAPI.Web.Integration.Tests.Services.Mailing.EmailTags;

[TestFixture]
public class EmailTagsServiceTests : DbTestFixture
{
    private ILogger<EmailTagsService> _logger;
    private ILocalizationService _localizationService;
    private IUserService _userService;
    private EmailTagsService _service;

    public override void DoSetup()
    {
        _logger = Substitute.For<ILogger<EmailTagsService>>();
        _localizationService = Substitute.For<ILocalizationService>();
        _userService = Substitute.For<IUserService>();
        
        _service = new EmailTagsService(
            _logger,
            DbContext,
            _localizationService,
            _userService);
    }

    [Test]
    public void EmailTagsService_InitializesCorrectly()
    {
        // Assert
        Assert.That(_service, Is.Not.Null);
    }
}

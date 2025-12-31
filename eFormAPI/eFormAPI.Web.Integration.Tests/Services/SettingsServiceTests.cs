/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

using NUnit.Framework;
using eFormAPI.Web.Services;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Microting.eFormApi.BasePn.Abstractions;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.WritableOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using eFormAPI.Web.Infrastructure.Models;
using eFormAPI.Web.Infrastructure.Models.Settings.Admin;
using eFormAPI.Web.Infrastructure.Models.Settings.Initial;

namespace eFormAPI.Web.Integration.Tests.Services
{
    [TestFixture]
    public class SettingsServiceTests : DbTestFixture
    {
        private ILogger<SettingsService> _logger;
        private IWritableOptions<ConnectionStrings> _connectionStrings;
        private IDbOptions<ApplicationSettings> _applicationSettings;
        private IDbOptions<LoginPageSettings> _loginPageSettings;
        private IDbOptions<HeaderSettings> _headerSettings;
        private IDbOptions<EmailSettings> _emailSettings;
        private IEFormCoreService _coreHelper;
        private ILocalizationService _localizationService;
        private IDbOptions<ConnectionStringsSdk> _connectionStringsSdk;
        private IDbOptions<EformTokenOptions> _tokenOptions;
        private SettingsService _settingsService;

        public override void DoSetup()
        {
            _logger = Substitute.For<ILogger<SettingsService>>();
            _connectionStrings = Substitute.For<IWritableOptions<ConnectionStrings>>();
            _applicationSettings = Substitute.For<IDbOptions<ApplicationSettings>>();
            _loginPageSettings = Substitute.For<IDbOptions<LoginPageSettings>>();
            _headerSettings = Substitute.For<IDbOptions<HeaderSettings>>();
            _emailSettings = Substitute.For<IDbOptions<EmailSettings>>();
            _coreHelper = Substitute.For<IEFormCoreService>();
            _localizationService = Substitute.For<ILocalizationService>();
            _connectionStringsSdk = Substitute.For<IDbOptions<ConnectionStringsSdk>>();
            _tokenOptions = Substitute.For<IDbOptions<EformTokenOptions>>();

            _localizationService.GetString(Arg.Any<string>())
                .Returns(args => args.Arg<string>());

            _connectionStringsSdk.Value.Returns(new ConnectionStringsSdk());
            _applicationSettings.Value.Returns(new ApplicationSettings());
            _loginPageSettings.Value.Returns(new LoginPageSettings());
            _headerSettings.Value.Returns(new HeaderSettings());
            _emailSettings.Value.Returns(new EmailSettings());
            _tokenOptions.Value.Returns(new EformTokenOptions());

            _settingsService = new SettingsService(
                _logger,
                _connectionStrings,
                _applicationSettings,
                _loginPageSettings,
                _headerSettings,
                _emailSettings,
                _coreHelper,
                _localizationService,
                _connectionStringsSdk,
                DbContext,
                _tokenOptions);
        }

        [Test]
        public void SettingsService_InitializesCorrectly()
        {
            // Assert
            Assert.That(_settingsService, Is.Not.Null);
        }

        [Test]
        public void GetDefaultLocale_WithNoLocale_ShouldReturnEnUS()
        {
            // Arrange
            var appSettings = new ApplicationSettings { DefaultLocale = null };
            _applicationSettings.Value.Returns(appSettings);

            // Act
            var result = _settingsService.GetDefaultLocale();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Success, Is.True);
            // The service returns "en-US" as the default when locale is null or empty
            Assert.That(result.Model, Is.EqualTo("en-US"));
        }

        [Test]
        public void GetDefaultLocale_WithCustomLocale_ShouldReturnCustomLocale()
        {
            // Arrange
            var customLocale = "de-DE";
            _applicationSettings.Value.Returns(new ApplicationSettings { DefaultLocale = customLocale });

            // Act
            var result = _settingsService.GetDefaultLocale();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Success, Is.True);
            Assert.That(result.Model, Is.EqualTo(customLocale));
        }

        [Test]
        public void ConnectionStringExist_WithNoConnectionString_ShouldReturnFalse()
        {
            // Arrange
            _connectionStringsSdk.Value.Returns(new ConnectionStringsSdk { SdkConnection = null });

            // Act
            var result = _settingsService.ConnectionStringExist();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Success, Is.False);
        }

        [Test]
        public void ConnectionStringExist_WithConnectionString_ShouldReturnTrue()
        {
            // Arrange
            _connectionStringsSdk.Value.Returns(new ConnectionStringsSdk { SdkConnection = "Server=localhost;" });

            // Act
            var result = _settingsService.ConnectionStringExist();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Success, Is.True);
        }
    }
}

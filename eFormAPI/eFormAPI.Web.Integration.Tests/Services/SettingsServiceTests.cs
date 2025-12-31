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
using Moq;
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
        private Mock<ILogger<SettingsService>> _logger;
        private Mock<IWritableOptions<ConnectionStrings>> _connectionStrings;
        private Mock<IDbOptions<ApplicationSettings>> _applicationSettings;
        private Mock<IDbOptions<LoginPageSettings>> _loginPageSettings;
        private Mock<IDbOptions<HeaderSettings>> _headerSettings;
        private Mock<IDbOptions<EmailSettings>> _emailSettings;
        private Mock<IEFormCoreService> _coreHelper;
        private Mock<ILocalizationService> _localizationService;
        private Mock<IDbOptions<ConnectionStringsSdk>> _connectionStringsSdk;
        private Mock<IDbOptions<EformTokenOptions>> _tokenOptions;
        private SettingsService _settingsService;

        public override void DoSetup()
        {
            _logger = new Mock<ILogger<SettingsService>>();
            _connectionStrings = new Mock<IWritableOptions<ConnectionStrings>>();
            _applicationSettings = new Mock<IDbOptions<ApplicationSettings>>();
            _loginPageSettings = new Mock<IDbOptions<LoginPageSettings>>();
            _headerSettings = new Mock<IDbOptions<HeaderSettings>>();
            _emailSettings = new Mock<IDbOptions<EmailSettings>>();
            _coreHelper = new Mock<IEFormCoreService>();
            _localizationService = new Mock<ILocalizationService>();
            _connectionStringsSdk = new Mock<IDbOptions<ConnectionStringsSdk>>();
            _tokenOptions = new Mock<IDbOptions<EformTokenOptions>>();

            _localizationService.Setup(x => x.GetString(It.IsAny<string>()))
                .Returns((string key) => key);

            _connectionStringsSdk.Setup(x => x.Value).Returns(new ConnectionStringsSdk());
            _applicationSettings.Setup(x => x.Value).Returns(new ApplicationSettings());
            _loginPageSettings.Setup(x => x.Value).Returns(new LoginPageSettings());
            _headerSettings.Setup(x => x.Value).Returns(new HeaderSettings());
            _emailSettings.Setup(x => x.Value).Returns(new EmailSettings());
            _tokenOptions.Setup(x => x.Value).Returns(new EformTokenOptions());

            _settingsService = new SettingsService(
                _logger.Object,
                _connectionStrings.Object,
                _applicationSettings.Object,
                _loginPageSettings.Object,
                _headerSettings.Object,
                _emailSettings.Object,
                _coreHelper.Object,
                _localizationService.Object,
                _connectionStringsSdk.Object,
                DbContext,
                _tokenOptions.Object);
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
            _applicationSettings.Setup(x => x.Value).Returns(new ApplicationSettings { DefaultLocale = null });

            // Act
            var result = _settingsService.GetDefaultLocale();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Success, Is.True);
            Assert.That(result.Model, Is.EqualTo("en-US"));
        }

        [Test]
        public void GetDefaultLocale_WithCustomLocale_ShouldReturnCustomLocale()
        {
            // Arrange
            var customLocale = "de-DE";
            _applicationSettings.Setup(x => x.Value).Returns(new ApplicationSettings { DefaultLocale = customLocale });

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
            _connectionStringsSdk.Setup(x => x.Value).Returns(new ConnectionStringsSdk { SdkConnection = null });

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
            _connectionStringsSdk.Setup(x => x.Value).Returns(new ConnectionStringsSdk { SdkConnection = "Server=localhost;" });

            // Act
            var result = _settingsService.ConnectionStringExist();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Success, Is.True);
        }
    }
}

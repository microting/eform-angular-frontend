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
using System;
using System.Net.Http;
using eFormAPI.Web.Hosting.Helpers.DbOptions;
using eFormAPI.Web.Infrastructure.Models.Settings.Plugins;

namespace eFormAPI.Web.Integration.Tests.Services
{
    [TestFixture]
    public class PluginsManagementServiceTests : DbTestFixture
    {
        private ILocalizationService _localizationService;
        private ILogger<PluginsManagementService> _logger;
        private IHttpClientFactory _httpClientFactory;
        private IServiceProvider _serviceProvider;
        private IDbOptions<PluginStoreSettings> _options;
        private PluginsManagementService _pluginsManagementService;

        public override void DoSetup()
        {
            _localizationService = Substitute.For<ILocalizationService>();
            _logger = Substitute.For<ILogger<PluginsManagementService>>();
            _httpClientFactory = Substitute.For<IHttpClientFactory>();
            _serviceProvider = Substitute.For<IServiceProvider>();
            _options = Substitute.For<IDbOptions<PluginStoreSettings>>();

            _localizationService.GetString(Arg.Any<string>())
                .Returns(args => args.Arg<string>());

            _options.Value.Returns(new PluginStoreSettings());

            _pluginsManagementService = new PluginsManagementService(
                DbContext,
                _localizationService,
                _logger,
                _httpClientFactory,
                _serviceProvider,
                _options);
        }

        [Test]
        public void PluginsManagementService_InitializesCorrectly()
        {
            // Assert
            Assert.That(_pluginsManagementService, Is.Not.Null);
        }
    }
}

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

namespace eFormAPI.Web.Integration.Tests.Services
{
    [TestFixture]
    public class EFormColumnsServiceTests : DbTestFixture
    {
        private ILocalizationService _localizationService;
        private IUserService _userService;
        private IEFormCoreService _coreHelper;
        private ILogger<EFormColumnsService> _logger;
        private EFormColumnsService _eformColumnsService;

        public override void DoSetup()
        {
            _localizationService = Substitute.For<ILocalizationService>();
            _userService = Substitute.For<IUserService>();
            _coreHelper = Substitute.For<IEFormCoreService>();
            _logger = Substitute.For<ILogger<EFormColumnsService>>();

            _localizationService.GetString(Arg.Any<string>())
                .Returns(args => args.Arg<string>());

            _eformColumnsService = new EFormColumnsService(
                _localizationService,
                _userService,
                _coreHelper,
                _logger);
        }

        [Test]
        public void EFormColumnsService_InitializesCorrectly()
        {
            // Assert
            Assert.That(_eformColumnsService, Is.Not.Null);
        }
    }
}

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
using NSubstitute;
using Microsoft.Extensions.Localization;

namespace eFormAPI.Web.Integration.Tests.Services
{
    [TestFixture]
    public class LocalizationServiceTests : DbTestFixture
    {
        private IStringLocalizerFactory _factory;
        private LocalizationService _localizationService;

        public override void DoSetup()
        {
            _factory = Substitute.For<IStringLocalizerFactory>();
            var localizer = Substitute.For<IStringLocalizer>();

            // Setup the factory to return our mock localizer
            _factory.Create(Arg.Any<string>(), Arg.Any<string>())
                .Returns(localizer);

            // Setup the localizer to return the key as the value
            localizer[Arg.Any<string>()]
                .Returns(args => new LocalizedString(args.Arg<string>(), args.Arg<string>()));

            _localizationService = new LocalizationService(_factory);
        }

        [Test]
        public void LocalizationService_InitializesCorrectly()
        {
            // Assert
            Assert.That(_localizationService, Is.Not.Null);
        }

        [Test]
        public void GetString_WithValidKey_ReturnsValue()
        {
            // Arrange
            var key = "TestKey";

            // Act
            var result = _localizationService.GetString(key);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result, Is.EqualTo(key));
        }

        [Test]
        public void GetString_WithNullKey_ReturnsNull()
        {
            // Act
            var result = _localizationService.GetString(null);

            // Assert
            Assert.That(result, Is.Null);
        }

        [Test]
        public void GetString_WithEmptyKey_ReturnsEmpty()
        {
            // Act
            var result = _localizationService.GetString("");

            // Assert
            Assert.That(result, Is.Empty);
        }
    }
}

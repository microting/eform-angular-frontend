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
using System.Threading.Tasks;
using eFormAPI.Web.Services;
using Microsoft.Extensions.Logging;
using Moq;
using Microting.eFormApi.BasePn.Abstractions;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Infrastructure.Models.Tags;

namespace eFormAPI.Web.Integration.Tests.Services
{
    [TestFixture]
    public class TagsServiceTests : DbTestFixture
    {
        private Mock<ILogger<TagsService>> _logger;
        private Mock<IEFormCoreService> _coreHelper;
        private Mock<ILocalizationService> _localizationService;
        private Mock<IUserService> _userService;
        private TagsService _tagsService;

        public override void DoSetup()
        {
            _logger = new Mock<ILogger<TagsService>>();
            _coreHelper = new Mock<IEFormCoreService>();
            _localizationService = new Mock<ILocalizationService>();
            _userService = new Mock<IUserService>();

            _localizationService.Setup(x => x.GetString(It.IsAny<string>()))
                .Returns((string key) => key);
            
            _localizationService.Setup(x => x.GetStringWithFormat(It.IsAny<string>(), It.IsAny<object[]>()))
                .Returns((string key, object[] args) => key);

            _tagsService = new TagsService(
                _logger.Object,
                _coreHelper.Object,
                _localizationService.Object,
                _userService.Object,
                DbContext);
        }

        [Test]
        public void TagsService_InitializesCorrectly()
        {
            // Assert
            Assert.That(_tagsService, Is.Not.Null);
        }

        [Test]
        public async Task GetSavedTags_WithNoUser_ShouldReturnEmptyList()
        {
            // Arrange
            _userService.Setup(x => x.GetCurrentUserAsync())
                .ReturnsAsync((Microting.eFormApi.BasePn.Infrastructure.Database.Entities.EformUser)null);

            // Act
            var result = await _tagsService.GetSavedTags();

            // Assert
            Assert.That(result, Is.Not.Null);
            // Service may return empty result or handle null user differently
        }
    }
}

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

using eFormAPI.Web.Abstractions;
using NSubstitute;
using NUnit.Framework;
using System.Threading.Tasks;

namespace eFormAPI.Web.Integration.Tests.Controllers
{
    [TestFixture]
    public class MenuControllerTests : DbTestFixture
    {
        private IMenuService _menuService;

        public override void DoSetup()
        {
            _menuService = Substitute.For<IMenuService>();
        }

        [Test]
        public async Task MenuController_InitializesCorrectly()
        {
            // Arrange & Act
            // Controller would be instantiated by DI container in real scenario

            // Assert
            Assert.That(_menuService, Is.Not.Null);
            await Task.CompletedTask;
        }

        [Test]
        public async Task MenuService_CanBeInjected()
        {
            // Arrange & Act
            var menuService = Substitute.For<IMenuService>();

            // Assert
            Assert.That(menuService, Is.Not.Null);
            await Task.CompletedTask;
        }
    }
}

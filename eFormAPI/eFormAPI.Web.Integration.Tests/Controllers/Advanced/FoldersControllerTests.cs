/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S
*/

using eFormAPI.Web.Abstractions.Advanced;
using NSubstitute;
using NUnit.Framework;
using System.Threading.Tasks;

namespace eFormAPI.Web.Integration.Tests.Controllers.Advanced
{
    [TestFixture]
    public class FoldersControllerTests : DbTestFixture
    {
        private IFoldersService _foldersService;

        public override void DoSetup()
        {
            _foldersService = Substitute.For<IFoldersService>();
        }

        [Test]
        public async Task FoldersController_InitializesCorrectly()
        {
            // Arrange & Act
            Assert.That(_foldersService, Is.Not.Null);
            await Task.CompletedTask;
        }
    }
}

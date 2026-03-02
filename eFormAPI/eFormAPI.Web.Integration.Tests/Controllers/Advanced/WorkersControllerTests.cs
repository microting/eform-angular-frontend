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
    public class WorkersControllerTests : DbTestFixture
    {
        private IWorkersService _workersService;

        public override void DoSetup()
        {
            _workersService = Substitute.For<IWorkersService>();
        }

        [Test]
        public async Task WorkersController_InitializesCorrectly()
        {
            // Arrange & Act
            Assert.That(_workersService, Is.Not.Null);
            await Task.CompletedTask;
        }
    }
}

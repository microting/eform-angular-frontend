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
    public class UnitsControllerTests : DbTestFixture
    {
        private IUnitsService _unitsService;

        public override void DoSetup()
        {
            _unitsService = Substitute.For<IUnitsService>();
        }

        [Test]
        public async Task UnitsController_InitializesCorrectly()
        {
            // Arrange & Act
            Assert.That(_unitsService, Is.Not.Null);
            await Task.CompletedTask;
        }
    }
}

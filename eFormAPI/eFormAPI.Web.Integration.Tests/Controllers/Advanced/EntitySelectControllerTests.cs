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
    public class EntitySelectControllerTests : DbTestFixture
    {
        private IEntitySelectService _entitySelectService;

        public override void DoSetup()
        {
            _entitySelectService = Substitute.For<IEntitySelectService>();
        }

        [Test]
        public async Task EntitySelectController_InitializesCorrectly()
        {
            // Arrange & Act
            Assert.That(_entitySelectService, Is.Not.Null);
            await Task.CompletedTask;
        }
    }
}

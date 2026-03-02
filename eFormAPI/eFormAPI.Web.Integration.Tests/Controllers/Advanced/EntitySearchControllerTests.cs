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
    public class EntitySearchControllerTests : DbTestFixture
    {
        private IEntitySearchService _entitySearchService;

        public override void DoSetup()
        {
            _entitySearchService = Substitute.For<IEntitySearchService>();
        }

        [Test]
        public async Task EntitySearchController_InitializesCorrectly()
        {
            // Arrange & Act
            Assert.That(_entitySearchService, Is.Not.Null);
            await Task.CompletedTask;
        }
    }
}

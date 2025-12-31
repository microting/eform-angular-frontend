/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S
*/

using eFormAPI.Web.Abstractions.Eforms;
using NSubstitute;
using NUnit.Framework;
using System.Threading.Tasks;

namespace eFormAPI.Web.Integration.Tests.Controllers.Eforms
{
    [TestFixture]
    public class CasesControllerTests : DbTestFixture
    {
        private ICasesService _casesService;

        public override void DoSetup()
        {
            _casesService = Substitute.For<ICasesService>();
        }

        [Test]
        public async Task CasesController_InitializesCorrectly()
        {
            // Arrange & Act
            Assert.That(_casesService, Is.Not.Null);
            await Task.CompletedTask;
        }
    }
}

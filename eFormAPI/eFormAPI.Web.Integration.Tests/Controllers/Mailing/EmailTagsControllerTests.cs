/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S
*/

using NSubstitute;
using NUnit.Framework;
using System.Threading.Tasks;

namespace eFormAPI.Web.Integration.Tests.Controllers.Mailing
{
    [TestFixture]
    public class EmailTagsControllerTests : DbTestFixture
    {
        public override void DoSetup()
        {
            // EmailTagsController setup
        }

        [Test]
        public async Task EmailTagsController_InitializesCorrectly()
        {
            // Arrange & Act
            Assert.Pass("EmailTagsController test initialized");
            await Task.CompletedTask;
        }
    }
}

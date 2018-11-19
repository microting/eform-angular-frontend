using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Text;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace eFormAPI.Web.Tests
{
    [TestFixture]
    public class UsersTest : DbTestFixture
    {

        public override void DoSetup()
        {

        }

        [Test]
        public void EformInGroupTest_CreateEformInGroup_ShouldCreatEformInGroup()
        {
            // Arrange
            EformUser eformUser = new EformUser();
            eformUser.Email = Guid.NewGuid().ToString();
            eformUser.FirstName = Guid.NewGuid().ToString();
            eformUser.LastName = Guid.NewGuid().ToString();

            DbContext.Users.Add(eformUser);
            DbContext.SaveChanges();

            // Act

            EformUser foundeformUser = DbContext.Users.Find(eformUser.Email);

            // Assert
            Assert.NotNull(foundeformUser);
            Assert.AreEqual(eformUser.FirstName, foundeformUser.FirstName);

        }
    }
}

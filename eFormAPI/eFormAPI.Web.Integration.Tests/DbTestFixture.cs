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

using Microsoft.EntityFrameworkCore;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace eFormAPI.Web.Integration.Tests
{
    [TestFixture]
    public abstract class DbTestFixture
    {
        protected BaseDbContext DbContext;
        protected string ConnectionString;

        private void GetContext(string connectionStr)
        {

            DbContextOptionsBuilder<BaseDbContext> dbContextOptionsBuilder = new DbContextOptionsBuilder<BaseDbContext>();
            dbContextOptionsBuilder.UseMySql(connectionStr,
                    new MariaDbServerVersion(
                        ServerVersion.AutoDetect(connectionStr)),
                    b => b.EnableRetryOnFailure()
                        .TranslateParameterizedCollectionsToConstants());
            DbContext = new BaseDbContext(dbContextOptionsBuilder.Options);

            DbContext.Database.Migrate();
            DbContext.Database.EnsureCreated();
        }

        [SetUp]
        public async Task Setup()
        {
            ConnectionString = @"Server = 127.0.0.1; port = 3306; Database = angular-tests; user = root; password = secretpassword; Convert Zero Datetime = true;";

            GetContext(ConnectionString);

            DbContext.Database.SetCommandTimeout(300);

            try
            {
                await ClearDb();
            }
            catch
            {
                await DbContext.Database.MigrateAsync();
            }

            DoSetup();
        }

        [TearDown]
        public async Task TearDown()
        {
            await ClearDb();

            await DbContext.DisposeAsync();
        }

        private async Task ClearDb()
        {
            Console.WriteLine("ClearDb called.");
            List<string> modelNames = new List<string>
            {
                "UserTokens",
                "UserRoles",
                "UserLogins",
                "UserClaims",
                "SecurityGroups",
                "Users",
                "Roles",
                "RoleClaims",
                "GroupPermissions",
                "EformPermissions",
                "EformInGroups",
                "MenuItems",
                "Permissions",
                "SecurityGroupUsers"
            };

            foreach (var modelName in modelNames)
            {
                try
                {
                    string sqlCmd;
                    if (DbContext.Database.IsMySql())
                    {
                        sqlCmd = $"SET FOREIGN_KEY_CHECKS = 0;TRUNCATE `{"eformsdk-tests"}`.`{modelName}`";
                    }
                    else
                    {
                        sqlCmd = $"DELETE FROM [{modelName}]";
                    }
#pragma warning disable EF1000 // Possible SQL injection vulnerability.
                    await DbContext.Database.ExecuteSqlRawAsync(sqlCmd);
#pragma warning restore EF1000 // Possible SQL injection vulnerability.

                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
        }

        public virtual void DoSetup() { }

    }
}

using eFormAPI.Web.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;

namespace eFormAPI.Web.Tests
{
    [TestFixture]
    public abstract class DbTestFixture
    {
        protected BaseDbContext DbContext;
        protected string ConnectionString;

        private BaseDbContext GetContext(string connectionStr)
        {

            DbContextOptionsBuilder<BaseDbContext> dbContextOptionsBuilder = new DbContextOptionsBuilder<BaseDbContext>();

            if (ConnectionString.ToLower().Contains("convert zero datetime"))
            {
                dbContextOptionsBuilder.UseMySql(connectionStr);
            }
            else
            {
                dbContextOptionsBuilder.UseSqlServer(connectionStr);
            }
            dbContextOptionsBuilder.UseLazyLoadingProxies(true);
            return new BaseDbContext(dbContextOptionsBuilder.Options);
        }

        [SetUp]
        public void Setup()
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                ConnectionString = @"data source=(LocalDb)\SharedInstance;Initial catalog=angular-tests;Integrated Security=True";
            }
            else
            {
                ConnectionString = @"Server = localhost; port = 3306; Database = angular-tests; user = root; Convert Zero Datetime = true;";
            }

            DbContext = GetContext(ConnectionString);


            DbContext.Database.SetCommandTimeout(300);

            try
            {
                ClearDb();
            }
            catch
            {

                DbContext.Database.Migrate();

            }

            DoSetup();
        }

        [TearDown]
        public void TearDown()
        {

            ClearDb();

            DbContext.Dispose();
        }

        public void ClearDb()
        {

            Console.WriteLine("ClearDb called.");
            List<string> modelNames = new List<string>();
            modelNames.Add("UserRoles");
            modelNames.Add("UserLogins");
            modelNames.Add("UserClaims");
            modelNames.Add("Users");
            modelNames.Add("Roles");
            modelNames.Add("Roles");


            foreach (var modelName in modelNames)
            {
                try
                {
                    string sqlCmd = string.Empty;
                    if (DbContext.Database.IsMySql())
                    {
                        sqlCmd = string.Format("SET FOREIGN_KEY_CHECKS = 0;TRUNCATE `{0}`.`{1}`", "angular-tests", modelName);
                    }
                    else
                    {
                        sqlCmd = string.Format("DELETE FROM [{0}]", modelName);
                    }
                    DbContext.Database.ExecuteSqlCommand(sqlCmd);
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

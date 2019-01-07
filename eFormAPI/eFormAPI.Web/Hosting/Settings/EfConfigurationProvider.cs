using System.Linq;
using Castle.Core.Internal;
using eFormAPI.Web.Infrastructure.Database.Factories;
using eFormAPI.Web.Infrastructure.Database.Seed.SeedItems;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace eFormAPI.Web.Hosting.Settings
{
    public class EfConfigurationProvider : ConfigurationProvider
    {
        private readonly string _connectionString;

        public EfConfigurationProvider(string connectionString)
        {
            _connectionString = connectionString;
            Program.ReloadDbConfigurationDelegate = ReloadConfiguration;
        }

        private void ReloadConfiguration()
        {
            Load();
            OnReload();
        }

        // Load config data from EF DB.
        public override void Load()
        {
            if (_connectionString.IsNullOrEmpty() || _connectionString == "...")
            {
                var seedData = ConfigurationSeed.Data;
                Data = seedData.ToDictionary(
                    item => item.Id,
                    item => item.Value);
            }
            else
            {
                var contextFactory = new BaseDbContextFactory();
                using (var dbContext = contextFactory.CreateDbContext(new[] {_connectionString}))
                {
                    dbContext.Database.Migrate();
                    Data = dbContext.ConfigurationValues
                        .AsNoTracking()
                        .ToDictionary(c => c.Id, c => c.Value);
                }
            }
        }
    }
}
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


namespace eFormAPI.Web.Hosting.Settings;

using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Factories;
using Microting.EformAngularFrontendBase.Infrastructure.Data.Seed.SeedItems;
using Castle.Core.Internal;
using Microsoft.Extensions.Configuration;
using Microting.eFormApi.BasePn.Infrastructure.Delegates;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;

public class EfConfigurationProvider : ConfigurationProvider
{
    private readonly string _connectionString;

    public EfConfigurationProvider(string connectionString)
    {
        _connectionString = connectionString;
        ReloadDbConfigurationDelegates.ReloadDbConfigurationDelegate += ReloadConfiguration;
    }

    private void ReloadConfiguration()
    {
        Load();
        OnReload();
    }

    // Load config data from EF DB.
    public override void Load()
    {
        if (string.IsNullOrEmpty(_connectionString) || _connectionString == "...")
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
                if (dbContext.Database.GetPendingMigrations().Any())
                {
                    Log.LogEvent("Migrating Angular DB");
                    dbContext.Database.Migrate();
                }
                Data = dbContext.ConfigurationValues
                    .AsNoTracking()
                    .ToDictionary(c => c.Id, c => c.Value);
            }
        }
    }
}
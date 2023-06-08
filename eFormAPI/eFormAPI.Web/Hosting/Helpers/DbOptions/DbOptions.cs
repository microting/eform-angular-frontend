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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Castle.Core.Internal;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Infrastructure.Delegates;

namespace eFormAPI.Web.Hosting.Helpers.DbOptions;

using Microting.EformAngularFrontendBase.Infrastructure.Data;

public class DbOptions<T> : IDbOptions<T> where T : class, new()
{
    private readonly IOptionsMonitor<T> _options;

    public DbOptions(IOptionsMonitor<T> options)
    {
        _options = options;
    }

    public T Value => _options.CurrentValue;

    public T Get(string name) => _options.Get(name);

    public async Task UpdateDb(Action<T> applyChanges, BaseDbContext dbContext)
    {
        var sectionObject = _options.CurrentValue;
        applyChanges(sectionObject);
        var dictionary = GetList(sectionObject, "");
        // Update values
        await UpdateConfig(dictionary, dbContext);
        // Reload configuration from database
        if (ReloadDbConfigurationDelegates.ReloadDbConfigurationDelegate != null)
        {
            var invocationList = ReloadDbConfigurationDelegates.ReloadDbConfigurationDelegate
                .GetInvocationList();
            foreach (var func in invocationList)
            {
                func.DynamicInvoke();
            }
        }
    }

    private static async Task UpdateConfig(Dictionary<string, string> dictionary, BaseDbContext dbContext)
    {
        var keys = dictionary.Select(x => x.Key).ToArray();
        var configs = dbContext.ConfigurationValues
            .Where(x => keys.Contains(x.Id))
            .ToList();

        foreach (var configElement in dictionary)
        {
            var config = configs
                .FirstOrDefault(x => x.Id == configElement.Key);
            if (config != null && config.Value != configElement.Value)
            {
                config.Value = configElement.Value;
                dbContext.ConfigurationValues.Update(config);
            }
        }

        await dbContext.SaveChangesAsync();
    }

    private static Dictionary<string, string> GetList(object currentObject, string prefix)
    {
        var dictionary = new Dictionary<string, string>();
        var sectionName = currentObject.GetType().Name;
        prefix = string.IsNullOrEmpty(prefix)
            ? $"{sectionName}"
            : $"{prefix}:{sectionName}";

        var types = new[]
        {
            typeof(string),
            typeof(int),
            typeof(bool),
            typeof(TimeSpan)
        };
        var properties = currentObject.GetType().GetProperties();
        foreach (var property in properties)
        {
            if (property.MemberType == MemberTypes.Property)
            {
                var value = property.GetValue(currentObject, null);
                var type = value.GetType();
                if (types.Contains(type))
                {
                    dictionary.Add($"{prefix}:{property.Name}", value.ToString());
                }
            }
        }

        return dictionary;
    }
}
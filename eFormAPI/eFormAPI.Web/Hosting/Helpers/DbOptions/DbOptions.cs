using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Castle.Core.Internal;
using eFormAPI.Web.Infrastructure.Database;
using Microsoft.Extensions.Options;

namespace eFormAPI.Web.Hosting.Helpers.DbOptions
{
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
            Program.ReloadDbConfigurationDelegate.Invoke();
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
            prefix = prefix.IsNullOrEmpty()
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
}
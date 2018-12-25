using System;
using System.IO;
using eFormAPI.Web.Infrastructure.Database;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace eFormAPI.Web.Hosting.Helpers.DbOptions
{
    public class DbOptions<T> : IDbOptions<T>  where T : class, new()
    {
        private readonly IOptionsMonitor<T> _options;
        private readonly string _section;

        public DbOptions(
            IOptionsMonitor<T> options,
            string section)
        {
            _options = options;
            _section = section;
        }

        public T Value => _options.CurrentValue;

        public T Get(string name) => _options.Get(name);

        public void Update(DbContextOptionsBuilder<BaseDbContext> dbContextOptionsBuilder, Action<T> applyChanges)
        {
            //using (var dbContext = new BaseDbContext())
            //{
                
            //}

            //var s = _options.CurrentValue;
            //var jObject = JsonConvert.DeserializeObject<JObject>(File.ReadAllText(physicalPath));
            //var sectionObject = jObject.TryGetValue(_section, out JToken section)
            //    ? JsonConvert.DeserializeObject<T>(section.ToString())
            //    : (Value ?? new T());

            //applyChanges(sectionObject);

            //jObject[_section] = JObject.Parse(JsonConvert.SerializeObject(sectionObject));
            //File.WriteAllText(physicalPath, JsonConvert.SerializeObject(jObject, Formatting.Indented));

        }


        //public void Update(DbContextOptionsBuilder<TDb> dbContextOptionsBuilder, Action<TModel> applyChanges);
        //{

        //var fileProvider = _environment.ContentRootFileProvider;
        //    var fileInfo = fileProvider.GetFileInfo(_file);
        //    var physicalPath = fileInfo.PhysicalPath;

        //    var jObject = JsonConvert.DeserializeObject<JObject>(File.ReadAllText(physicalPath));
        //    var sectionObject = jObject.TryGetValue(_section, out JToken section)
        //        ? JsonConvert.DeserializeObject<T>(section.ToString())
        //        : (Value ?? new T());

        //    applyChanges(sectionObject);

        //    jObject[_section] = JObject.Parse(JsonConvert.SerializeObject(sectionObject));
        //    File.WriteAllText(physicalPath, JsonConvert.SerializeObject(jObject, Formatting.Indented));
        //}
    }
}
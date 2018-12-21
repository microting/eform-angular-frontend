using System;
using System.IO;
using Castle.Core.Internal;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Newtonsoft.Json;

namespace eFormAPI.Web.Hosting.Settings
{
    public class MainSettings
    {
        public ConnectionStrings ConnectionStrings { get; set; }
            = new ConnectionStrings();
    }

    public class ConnectionStringManager
    {
        private string _connectionString;

        public string ConnectionString
        {
            get
            {
                if (!_connectionString.IsNullOrEmpty())
                {
                    return _connectionString;
                }

                _connectionString = Read().DefaultConnection;
                return _connectionString;
            }
        }

        public ConnectionStrings Read()
        {
            try
            {
                var filePath = GetFilePath();
                var deserializedProduct = JsonConvert.DeserializeObject<ConnectionStrings>(File.ReadAllText(filePath));
                return deserializedProduct;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public static void CreateDefalt(string filePath)
        {
            var mainSettings = new MainSettings()
            {
                ConnectionStrings = new ConnectionStrings()
                {
                    DefaultConnection = "...",
                }
            };
            Save(mainSettings, filePath);
        }

        public static void Save(MainSettings mainSettings, string filePath)
        {
            try
            {
                var output = JsonConvert.SerializeObject(mainSettings);
                File.WriteAllText(filePath, output);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public static string GetFilePath()
        {
            var dir = Directory.GetCurrentDirectory();
            return Path.Combine(dir, "connection.json");
        }
    }
}
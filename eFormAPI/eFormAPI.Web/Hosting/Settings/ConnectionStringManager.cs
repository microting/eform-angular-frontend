using System;
using System.IO;
using System.Text;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Newtonsoft.Json;

namespace eFormAPI.Web.Hosting.Settings
{
    public class MainSettings
    {
        public ConnectionStrings ConnectionStrings { get; set; }
            = new ConnectionStrings();
    }

    public static class ConnectionStringManager
    {
        public static MainSettings Read(string filePath)
        {
            try
            {
                var deserializedProduct = JsonConvert.DeserializeObject<MainSettings>(File.ReadAllText(filePath));
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
                File.WriteAllText(filePath, output, Encoding.UTF8);
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
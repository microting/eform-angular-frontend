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
using System.IO;
using System.Text;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Newtonsoft.Json;

namespace eFormAPI.Web.Hosting.Settings;

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

    public static void CreateDefault(string filePath)
    {
        var mainSettings = new MainSettings()
        {
            ConnectionStrings = new ConnectionStrings()
            {
                DefaultConnection = "..."
            }
        };
        Save(mainSettings, filePath);
    }

    public static void CreateWithConnectionString(string filePath, string connectionString)
    {
        var mainSettings = new MainSettings()
        {
            ConnectionStrings = new ConnectionStrings()
            {
                DefaultConnection = connectionString
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
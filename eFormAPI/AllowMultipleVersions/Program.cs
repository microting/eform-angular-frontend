using System;
using System.Linq;
using Microsoft.Deployment.WindowsInstaller;

namespace AllowMultipleVersions
{
    class Program
    {
        static int Main(string[] args)
        {
            try
            {
                using (var database = new Database(args.First(), DatabaseOpenMode.Direct))
                {
                    database.Execute("DELETE FROM InstallExecuteSequence WHERE Action ='RegisterProduct'");
                    database.Commit();
                }
                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error occured during operation");
                Console.WriteLine(ex.Message);
                return -1;
            }
        }
    }
}

using System;

namespace eFormAPI.Web.Infrastructure.Helpers
{
    public static class Log
    {
        public static void LogEvent(string appendText)
        {
            try
            {                
                var oldColor = Console.ForegroundColor;
                Console.ForegroundColor = ConsoleColor.Gray;
                Console.WriteLine(@"[DBG] " + appendText);
                Console.ForegroundColor = oldColor;
            }
            catch
            {
            }
        }

        public static void LogException(string appendText)
        {
            try
            {
                var oldColor = Console.ForegroundColor;
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(@"[ERR] " + appendText);
                Console.ForegroundColor = oldColor;
            }
            catch
            {

            }
        }
    }
}
using System.Threading;
using EformBase.Pn.Properties;

namespace EformBase.Pn.Infrastructure.Helpers
{
    public static class LocaleHelper
    {
        public static string GetString(string str)
        {
            var message = Resources.ResourceManager.GetString(str, Thread.CurrentThread.CurrentCulture);
            return message;
        }

        public static string GetString(string format, params object[] args)
        {
            var message = Resources.ResourceManager.GetString(format, Thread.CurrentThread.CurrentCulture);
            if (message == null)
            {
                return null;
            }
            message = string.Format(message, args);
            return message;
        }
    }
}
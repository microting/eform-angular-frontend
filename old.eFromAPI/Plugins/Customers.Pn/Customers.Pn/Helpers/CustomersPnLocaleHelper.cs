using System.Threading;
using Customers.Pn.Properties;

namespace Customers.Pn.Helpers
{
    public static class CustomersPnLocaleHelper
    {
        public static string GetString(string str)
        {
            var message = CustomersPnResources.ResourceManager.GetString(str, Thread.CurrentThread.CurrentCulture);
            return message;
        }

        public static string GetString(string format, params object[] args)
        {
            var message = CustomersPnResources.ResourceManager.GetString(format, Thread.CurrentThread.CurrentCulture);
            if (message == null)
            {
                return null;
            }
            message = string.Format(message, args);
            return message;
        }
    }
}

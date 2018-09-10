using System.Collections.Generic;
using System.Linq;

namespace Customers.Pn.Infrastructure.Extensions
{
    public static class ObjectExtensions
    {
        public static object GetPropValue(this object src, string propName)
        {
            return src.GetType().GetProperty(propName)?.GetValue(src, null);
        }
        public static List<string> GetPropList(this object src)
        {
            return src.GetType().GetProperties().Select(x=>x.Name).ToList();
        }
    }
}

using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Configuration;
using Castle.Core.Internal;
using Microsoft.Owin;

namespace eFormAPI.Web.Infrastructure.Attributes
{
    public class LocaleMiddleware : OwinMiddleware
    {
        public LocaleMiddleware(OwinMiddleware next) :
            base(next)
        {
        }

        public override async Task Invoke(IOwinContext context)
        {
            var claimsPrincipal = context.Authentication?.User;
            var locale = claimsPrincipal?.Claims.SingleOrDefault(x => x.Type == "locale")?.Value;
            if (locale.IsNullOrEmpty())
            {
                var configuration = WebConfigurationManager.OpenWebConfiguration("~");
                var section = (AppSettingsSection)configuration.GetSection("appSettings");

                var defaltLocale = section.Settings["general:defaultLocale"]?.Value;
                if (!defaltLocale.IsNullOrEmpty())
                {
                    SetCultureOnThread(defaltLocale);
                }
                else
                {
                    SetCultureOnThread("en-US");
                }
                await Next.Invoke(context);
                return;
            }
            SetCultureOnThread(locale);
            await Next.Invoke(context);
        }

        private static void SetCultureOnThread(string locale)
        {
            var cultureIfo = new CultureInfo(locale);
            Thread.CurrentThread.CurrentCulture = cultureIfo;
            Thread.CurrentThread.CurrentCulture = cultureIfo;
            CultureInfo.DefaultThreadCurrentCulture = cultureIfo;
            CultureInfo.DefaultThreadCurrentUICulture = cultureIfo;
        }
    }
}
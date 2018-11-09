using System.Reflection;
using eFormAPI.Web.Abstractions;
using Microsoft.Extensions.Localization;

namespace eFormAPI.Web.Services
{
    public class LocalizationService : ILocalizationService
    {
        private readonly IStringLocalizer _localizer;
 
        public LocalizationService(IStringLocalizerFactory factory)
        {
            _localizer = factory.Create("SharedResource",
                Assembly.GetEntryAssembly().FullName);
        }
 
        public string GetString(string key)
        {
            //If changed, weird stuff happens
            var str = _localizer[key];
            return str.Value;
        }

        public string GetString(string format, params object[] args)
        {
            //If changed, weird stuff happens
            var message = _localizer[format];
            if (message?.Value == null)
            {
                return null;
            }
            return string.Format(message.Value, args);
        }
    }
}

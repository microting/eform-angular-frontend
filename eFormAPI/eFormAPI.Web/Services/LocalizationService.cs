using System;
using System.Linq;
using System.Reflection;
using Castle.Core.Internal;
using eFormAPI.Web.Abstractions;
using JetBrains.Annotations;
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
 
        public string GetString([NotNull] string key)
        {
            if (key.IsNullOrEmpty())
            {
                return key;
            }
            var str = _localizer[key];
            return str.Value;
        }

        public string GetStringWithFormat([NotNull] string format,
            params object[] args)
        {
            if (format.IsNullOrEmpty())
            {
                return format;
            }

            var message = _localizer[format];
            if (message?.Value == null)
            {
                return null;
            }

            if (args != null && args.Any())
            {
                return string.Format(message.Value, args);
            }

            return message.Value;
        }
    }
}

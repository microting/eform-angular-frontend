using Customers.Pn.Abstractions;
using Microsoft.Extensions.Localization;
using Microting.eFormApi.BasePn.Localization.Abstractions;

namespace Customers.Pn.Services
{
    public class CustomersLocalizationService : ICustomersLocalizationService
    {
        private readonly IStringLocalizer _localizer;

        // ReSharper disable once SuggestBaseTypeForParameter
        public CustomersLocalizationService(IEformLocalizerFactory factory)
        {
            _localizer = factory.Create(typeof(EformCustomersPlugin));
        }

        public string GetString(string key)
        {
            var str = _localizer.GetString(key);
            return str.Value;
        }

        public string GetString(string format, params object[] args)
        {
            var message = _localizer[format];
            if (message?.Value == null)
            {
                return null;
            }

            return string.Format(message.Value, args);
        }
    }
}
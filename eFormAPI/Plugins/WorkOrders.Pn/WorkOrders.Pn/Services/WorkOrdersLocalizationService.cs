using Microsoft.Extensions.Localization;
using Microting.eFormApi.BasePn.Localization.Abstractions;
using WorkOrders.Pn.Abstractions;

namespace WorkOrders.Pn.Services
{
    public class WorkOrdersLocalizationService : IWorkOrdersLocalizationService
    {
        private readonly IStringLocalizer _localizer;

        // ReSharper disable once SuggestBaseTypeForParameter
        public WorkOrdersLocalizationService(IEformLocalizerFactory factory)
        {
            _localizer = factory.Create(typeof(EformWorkOrdersPlugin));
        }

        public string GetString(string key)
        {
            LocalizedString str = _localizer[key];
            return str.Value;
        }

        public string GetString(string format, params object[] args)
        {
            LocalizedString message = _localizer[format];
            if (message?.Value == null)
            {
                return null;
            }

            return string.Format(message.Value, args);
        }
    }
}

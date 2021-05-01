using Appointment.Pn.Abstractions;
using Microsoft.Extensions.Localization;
using Microting.eFormApi.BasePn.Localization.Abstractions;

namespace Appointment.Pn.Services
{
    public class AppointmentLocalizationService :IAppointmentLocalizationService
    {
        private readonly IStringLocalizer _localizer;
        
        // ReSharper disable once SuggestBaseTypeForParameter
        public AppointmentLocalizationService(IEformLocalizerFactory factory)
        {
            _localizer = factory.Create(typeof(EformAppointmentPlugin));
        }
        
        public string GetString(string key)
        {
            var str = _localizer[key];
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
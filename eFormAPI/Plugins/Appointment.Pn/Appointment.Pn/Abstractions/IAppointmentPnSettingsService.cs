using System.Threading.Tasks;
using Appointment.Pn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace Appointment.Pn.Abstractions
{
    public interface IAppointmentPnSettingsService
    {
        Task<OperationDataResult<AppointmentBaseSettings>> GetSettings();
        Task<OperationResult> UpdateSettings(AppointmentBaseSettings appointmentBaseSettings);
    }
}
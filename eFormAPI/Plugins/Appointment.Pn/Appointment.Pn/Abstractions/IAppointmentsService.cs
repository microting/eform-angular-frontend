using System.Threading.Tasks;
using Appointment.Pn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace Appointment.Pn.Abstractions
{
    public interface IAppointmentsService
    {
        Task<OperationDataResult<AppointmentsListModel>> Index(AppointmentRequestModel requestModel);
        Task<OperationResult> Create(AppointmentModel appointmentModel);
        Task<OperationDataResult<AppointmentModel>> Read(int id);
        Task<OperationResult> Update(AppointmentModel appointmentModel);
        Task<OperationResult> Delete(int id);
    }
}
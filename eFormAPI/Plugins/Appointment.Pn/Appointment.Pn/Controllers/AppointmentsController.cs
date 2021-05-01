using System.Threading.Tasks;
using Appointment.Pn.Abstractions;
using Appointment.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.AppointmentBase.Infrastructure.Data.Constants;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace Appointment.Pn.Controllers
{
    [Authorize]
    public class AppointmentsController : Controller
    {
        private readonly IAppointmentsService _appointmentsService;

        public AppointmentsController(IAppointmentsService appointmentsService)
        {
            _appointmentsService = appointmentsService;
        }

        [HttpGet]
        [Route("api/appointment-pn/appointments")]
        public async Task<OperationDataResult<AppointmentsListModel>> Index(AppointmentRequestModel requestModel)
        {
            return await _appointmentsService.Index(requestModel);
        }

        [HttpGet]
        [Route("api/appointment-pn/appointments/{id}")]
        public async Task<OperationDataResult<AppointmentModel>> Read(int id)
        {
            return await _appointmentsService.Read(id);
        }

        [HttpPost]
        [Route("api/appointment-pn/appointments")]
        [Authorize(Policy = AppointmentClaims.CreateAppointments)]
        public async Task<OperationResult> Create([FromBody] AppointmentModel createModel)
        {
            return await _appointmentsService.Create(createModel);
        }

        [HttpPut]
        [Route("api/appointment-pn/appointments")]
        public async Task<OperationResult> Update([FromBody] AppointmentModel updateModel)
        {
            return await _appointmentsService.Update(updateModel);
        }

        [HttpDelete]
        [Route("api/appointment-pn/appointments/{id}")]
        public async Task<OperationResult> Delete(int id)
        {
            return await _appointmentsService.Delete(id);
        }
    }
}
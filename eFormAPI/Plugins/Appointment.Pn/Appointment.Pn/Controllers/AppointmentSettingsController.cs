using System.Threading.Tasks;
using Appointment.Pn.Abstractions;
using Appointment.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace Appointment.Pn.Controllers
{
    public class AppointmentSettingsController : Controller
    {
        private readonly IAppointmentPnSettingsService _appointmentPnSettingsService;

        public AppointmentSettingsController(IAppointmentPnSettingsService appointmentPnSettingsService)
        {
            _appointmentPnSettingsService = appointmentPnSettingsService;
        }

        [HttpGet]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/appointment-pn/settings")]
        public async Task<OperationDataResult<AppointmentBaseSettings>> GetSettings()
        {
            return await _appointmentPnSettingsService.GetSettings();
        }

        [HttpPost]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/appointment-pn/settings")]
        public async Task<OperationResult> UpdateSettings([FromBody] AppointmentBaseSettings appointmentBaseSettings)
        {
            return await _appointmentPnSettingsService.UpdateSettings(appointmentBaseSettings);
        }

        
    }
}
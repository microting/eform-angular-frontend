using Microting.AppointmentBase.Infrastructure.Data.Constants;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace Appointment.Pn.Infrastructure.Data.Seed.Data
{
    public static class AppointmentPermissionsSeedData
    {
        public static PluginPermission[] Data => new[]
        {
            new PluginPermission()
            {
                PermissionName = "Access Appointment Plugin",
                ClaimName = AppointmentClaims.AccessAppointmentPlugin
            },
            new PluginPermission()
            {
                PermissionName = "Create Appointments",
                ClaimName = AppointmentClaims.CreateAppointments
            },
        };
    }
}
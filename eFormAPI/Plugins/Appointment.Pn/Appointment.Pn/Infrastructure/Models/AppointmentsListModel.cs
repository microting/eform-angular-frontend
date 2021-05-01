using System.Collections.Generic;

namespace Appointment.Pn.Infrastructure.Models
{
    public class AppointmentsListModel
    {
        public int Total { get; set; }
        public List<AppointmentSimpleModel> Appointments { get; set; }

        public AppointmentsListModel()
        {
            Appointments = new List<AppointmentSimpleModel>();
        }
    }
}
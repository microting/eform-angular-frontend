using System;
using Microting.AppointmentBase.Infrastructure.Data.Enums;

namespace Appointment.Pn.Infrastructure.Models
{
    public class AppointmentSimpleModel
    {
        public int Id { get; set; }

        public DateTime? StartAt { get; set; }
        public DateTime? ExpireAt { get; set; }
        public string Title { get; set; }
        public string ColorHex { get; set; }

        public int? RepeatEvery { get; set; }
        public RepeatType? RepeatType { get; set; }
        public DateTime? RepeatUntil { get; set; }
        public int? NextId { get; set; }
    }
}
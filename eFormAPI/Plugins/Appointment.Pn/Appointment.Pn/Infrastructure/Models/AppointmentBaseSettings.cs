namespace Appointment.Pn.Infrastructure.Models
{
    public class AppointmentBaseSettings
    {
        public string LogLevel { get; set; }
        
        public string LogLimit { get; set; }
        
        public string SdkConnectionString { get; set; }
        
        public int MaxParallelismPlugin { get; set; }
        
        public int NumberOfWorkersPlugin { get; set; }
        
        public int MaxParallelismService { get; set; }

        public int NumberOfWorkersService { get; set; }

        public string Token { get; set; }
        
        public int CheckPreSendHours { get; set; }
        
        public int CheckRetraceHours { get; set; }
        
        public int CheckEveryMinute { get; set; }
        
        public bool IncludeBlankLocations { get; set; }
        
        public string UserEmailAddress { get; set; }
        
        public string CalendarName { get; set; }
        
        public string DirectoryId { get; set; }
        
        public string ApplicationId { get; set; }
        
        public bool ColorsRule { get; set; }
        
        public string OutlookAddinId { get; set; }
        
    }
}
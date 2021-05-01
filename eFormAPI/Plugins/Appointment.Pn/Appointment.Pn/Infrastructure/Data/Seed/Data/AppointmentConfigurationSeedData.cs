using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace Appointment.Pn.Infrastructure.Data.Seed.Data
{
    public class AppointmentConfigurationSeedData : IPluginConfigurationSeedData
    {
        public PluginConfigurationValue[] Data => new[]
        {
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:LogLevel",
                Value = "4"
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:LogLimit",
                Value = "25000"
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:SdkConnectionString",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:MaxParallelismPlugin",
                Value = "1"
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:NumberOfWorkersPlugin",
                Value = "1"
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:MaxParallelismService",
                Value = "1"
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:NumberOfWorkersService",
                Value = "1"
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:Token",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:CheckPreSendHours",
                Value = "36"
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:CheckRetraceHours",
                Value = "36"
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:CheckEveryMinute",
                Value = "15"
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:IncludeBlankLocations",
                Value = "false"
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:ColorsRule",
                Value = "false"
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:UserEmailAddress",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:CalendarName",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:DirectoryId",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:ApplicationId",
                Value = "..."
            },
            new PluginConfigurationValue()
            {
                Name = "AppointmentBaseSettings:OutlookAddinId",
                Value = "..."
            },
        };
    }
}
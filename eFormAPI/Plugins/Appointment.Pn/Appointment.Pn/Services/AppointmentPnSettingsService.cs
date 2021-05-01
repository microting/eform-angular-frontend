using System;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Appointment.Pn.Abstractions;
using Appointment.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.AppointmentBase.Infrastructure.Data;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace Appointment.Pn.Services
{
    public class AppointmentPnSettingsService :IAppointmentPnSettingsService
    {
        private readonly ILogger<AppointmentPnSettingsService> _logger;
        private readonly IAppointmentLocalizationService _trashInspectionLocalizationService;
        private readonly AppointmentPnDbContext _dbContext;
        private readonly IEFormCoreService _coreHelper;
        private readonly IPluginDbOptions<AppointmentBaseSettings> _options;
        private readonly string _connectionString;
        private readonly IHttpContextAccessor _httpContextAccessor;
        
        public AppointmentPnSettingsService(ILogger<AppointmentPnSettingsService> logger,
            IAppointmentLocalizationService trashInspectionLocalizationService,
            AppointmentPnDbContext dbContext,
            IPluginDbOptions<AppointmentBaseSettings> options,
            IEFormCoreService coreHelper,
            IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _options = options;
            _httpContextAccessor = httpContextAccessor;
            _trashInspectionLocalizationService = trashInspectionLocalizationService;
        }
        
        public async Task<OperationDataResult<AppointmentBaseSettings>> GetSettings()
        {
            try
            {
                var option = _options.Value;
                if (option.Token == "...")
                {
                    string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                    Random random = new Random();
                    string result = new string(chars.Select(c => chars[random.Next(chars.Length)]).Take(32).ToArray());
                    await _options.UpdateDb(settings => { settings.Token = result;}, _dbContext, UserId);
                }

                if (option.SdkConnectionString == "...")
                {
                    string connectionString = _dbContext.Database.GetDbConnection().ConnectionString;

                    string dbNameSection = Regex.Match(connectionString, @"(Database=(...)_eform-angular-\w*-plugin;)").Groups[0].Value;
                    string dbPrefix = Regex.Match(connectionString, @"Database=(\d*)_").Groups[1].Value;
                    string sdk = $"Database={dbPrefix}_SDK;";
                    connectionString = connectionString.Replace(dbNameSection, sdk);
                    await _options.UpdateDb(settings => { settings.SdkConnectionString = connectionString;}, _dbContext, UserId);

                }

                if (option.OutlookAddinId == "..." || string.IsNullOrEmpty(option.OutlookAddinId))
                {
                    await _options.UpdateDb(settings => settings.OutlookAddinId = Guid.NewGuid().ToString(), _dbContext, UserId);
                }

                return new OperationDataResult<AppointmentBaseSettings>(true, option);
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<AppointmentBaseSettings>(false,
                    _trashInspectionLocalizationService.GetString("ErrorWhileObtainingTrashInspectionSettings"));
            }
        }

        public async Task<OperationResult> UpdateSettings(AppointmentBaseSettings appointmentBaseSettings)
        {
            try
            {
                await _options.UpdateDb(settings =>
                {
                    settings.Token = appointmentBaseSettings.Token;
                    settings.LogLevel = appointmentBaseSettings.LogLevel;
                    settings.LogLimit = appointmentBaseSettings.LogLimit;
                    settings.SdkConnectionString = appointmentBaseSettings.SdkConnectionString;
                    settings.MaxParallelismPlugin = appointmentBaseSettings.MaxParallelismPlugin;
                    settings.NumberOfWorkersPlugin = appointmentBaseSettings.NumberOfWorkersPlugin;
                    settings.MaxParallelismService = appointmentBaseSettings.MaxParallelismService;
                    settings.NumberOfWorkersService = appointmentBaseSettings.NumberOfWorkersService;
                    settings.CheckPreSendHours = appointmentBaseSettings.CheckPreSendHours;
                    settings.CheckRetraceHours = appointmentBaseSettings.CheckRetraceHours;
                    settings.CheckEveryMinute = appointmentBaseSettings.CheckEveryMinute;
                    settings.IncludeBlankLocations = appointmentBaseSettings.IncludeBlankLocations;
                    settings.UserEmailAddress = appointmentBaseSettings.UserEmailAddress;
                    settings.CalendarName = appointmentBaseSettings.CalendarName;
                    settings.DirectoryId = appointmentBaseSettings.DirectoryId;
                    settings.ApplicationId = appointmentBaseSettings.ApplicationId;
                    settings.ColorsRule = appointmentBaseSettings.ColorsRule;
                    settings.OutlookAddinId = appointmentBaseSettings.OutlookAddinId;
                }, _dbContext, UserId);

                return new OperationResult(true,
                    _trashInspectionLocalizationService.GetString("SettingsHaveBeenUpdatedSuccessfully"));
            }
            catch(Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationResult(false, _trashInspectionLocalizationService.GetString("ErrorWhileUpdatingSettings"));
            }
        }
        
        public int UserId
        {
            get
            {
                var value = _httpContextAccessor?.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                return value == null ? 0 : int.Parse(value);
            }
        }
    }
}
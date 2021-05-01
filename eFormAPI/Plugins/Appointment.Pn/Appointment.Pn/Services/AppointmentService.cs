using System;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Appointment.Pn.Abstractions;
using Appointment.Pn.Infrastructure.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microting.AppointmentBase.Infrastructure.Data;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Entities = Microting.AppointmentBase.Infrastructure.Data.Entities;

namespace Appointment.Pn.Services
{
    using Microting.eForm.Infrastructure.Constants;

    public class AppointmentsService : IAppointmentsService
    {
        private readonly IAppointmentLocalizationService _appointmentLocalizationService;
        private readonly AppointmentPnDbContext _dbContext;
        private readonly IEFormCoreService _coreHelper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AppointmentsService(
            AppointmentPnDbContext dbContext,
            IAppointmentLocalizationService appointmentLocalizationService,
            IHttpContextAccessor httpContextAccessor,
            IEFormCoreService coreHelper
        )
        {
            _dbContext = dbContext;
            _appointmentLocalizationService = appointmentLocalizationService;
            _httpContextAccessor = httpContextAccessor;
            _coreHelper = coreHelper;
        }
        public async Task<OperationDataResult<AppointmentsListModel>> Index(AppointmentRequestModel requestModel)
        {
            try
            {
                var list = await _dbContext.Appointments
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed
                                && requestModel.EndDate > x.StartAt
                                && (requestModel.StartDate < x.StartAt
                                    || x.RepeatType != null 
                                    && x.NextId == null
                                    && (x.RepeatUntil == null || x.RepeatUntil > requestModel.StartDate)))
                    .Select(x => new AppointmentSimpleModel()
                        {
                            Id = x.Id,
                            StartAt = x.StartAt,
                            ExpireAt = x.ExpireAt,
                            Title = x.Title,
                            ColorHex = x.ColorHex,
                            RepeatUntil = x.RepeatUntil,
                            RepeatEvery = x.RepeatEvery,
                            RepeatType = x.RepeatType,
                            NextId = x.NextId
                        }
                    ).ToListAsync();

                var listModel = new AppointmentsListModel { Total = list.Count(), Appointments = list };

                return new OperationDataResult<AppointmentsListModel>(true, listModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<AppointmentsListModel>(false,
                    _appointmentLocalizationService.GetString("ErrorGettingAppointmentsList"));
            }
        }
        
        public async Task<OperationResult> Create(AppointmentModel appointmentModel)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    if (appointmentModel.ExpireAt == null || appointmentModel.StartAt == null || 
                        appointmentModel.ExpireAt <= appointmentModel.StartAt || appointmentModel.StartAt <= DateTime.UtcNow)
                    {
                        return new OperationResult(
                            false,
                            _appointmentLocalizationService.GetString("AppointmentDateNotCorrect"));
                    }

                    var appointment = new Entities.Appointment
                    {
                        CreatedAt = DateTime.UtcNow,
                        CreatedByUserId = UserId,
                        ExpireAt = appointmentModel.ExpireAt,
                        StartAt = appointmentModel.StartAt,
                        Info = appointmentModel.Info,
                        Description = appointmentModel.Description,
                        Title = appointmentModel.Title,
                        ColorHex = appointmentModel.ColorHex,
                        RepeatEvery = appointmentModel.RepeatEvery,
                        RepeatType = appointmentModel.RepeatType,
                        RepeatUntil = appointmentModel.RepeatUntil,
                        SdkeFormId = appointmentModel.eFormId
                    };

                    await appointment.Create(_dbContext);

                    foreach (var siteUid in appointmentModel.SiteUids)
                    {
                        var appointmentSite = new Entities.AppointmentSite()
                        {
                            AppointmentId = appointment.Id,
                            MicrotingSiteUid = siteUid
                        };
                        await appointmentSite.Create(_dbContext);
                    }

                    transaction.Commit();
                    return new OperationResult(
                        true,
                        _appointmentLocalizationService.GetString("AppointmentCreatedSuccessfully"));
                }
                catch (Exception e)
                {
                    transaction.Rollback();
                    Trace.TraceError(e.Message);
                    return new OperationResult(false,
                        _appointmentLocalizationService.GetString("ErrorWhileCreatingAppointment"));
                }
            }
        }
        
        public async Task<OperationDataResult<AppointmentModel>> Read(int id)
        {
            try
            {
                var appointmentModel = await _dbContext.Appointments
                    .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed && x.Id == id)
                    .Select(x => new AppointmentModel
                    {
                        Id = x.Id,
                        StartAt = x.StartAt,
                        ExpireAt = x.ExpireAt,
                        Title = x.Title,
                        Description = x.Description,
                        Info = x.Info,
                        ColorHex = x.ColorHex,
                        RepeatUntil = x.RepeatUntil,
                        RepeatEvery = x.RepeatEvery,
                        RepeatType = x.RepeatType,
                        eFormId = x.SdkeFormId,
                        SiteUids = x.AppointmentSites.Where(s => s.WorkflowState != Constants.WorkflowStates.Removed).Select(s => s.MicrotingSiteUid).ToList(),
                        Fields = x.AppointmentPrefillFieldValues.Where(s => s.WorkflowState != Constants.WorkflowStates.Removed)
                            .Select(f => new AppointmentFieldModel()
                                {
                                    Id = f.Id,
                                    FieldId = f.FieldId,
                                    FieldValue = f.FieldValue
                                }
                            ).ToList()
                    }).FirstOrDefaultAsync();

                if (appointmentModel == null)
                {
                    return new OperationDataResult<AppointmentModel>(
                        false,
                        _appointmentLocalizationService.GetString("AppointmentNotFound"));
                }

                return new OperationDataResult<AppointmentModel>(true, appointmentModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                return new OperationDataResult<AppointmentModel>(false,
                    _appointmentLocalizationService.GetString("ErrorGettingAppointment"));
            }
        }

        

        

        public async Task<OperationResult> Update(AppointmentModel appointmentModel)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    Debugger.Break();
                    var appointment = await _dbContext.Appointments
                        .Include(x => x.AppointmentSites)
                        .Include(x => x.AppointmentPrefillFieldValues)
                        .FirstOrDefaultAsync(x => x.Id == appointmentModel.Id);

                    if (appointment.StartAt <= DateTime.UtcNow)
                    {
                        return new OperationResult(
                            false,
                            _appointmentLocalizationService.GetString("CannotEditAppointment"));
                    }

                    if (appointmentModel.ExpireAt == null || appointmentModel.StartAt == null ||
                        appointmentModel.ExpireAt <= appointmentModel.StartAt || appointmentModel.StartAt <= DateTime.UtcNow)
                    {
                        return new OperationResult(
                            false,
                            _appointmentLocalizationService.GetString("AppointmentDateNotCorrect"));
                    }

                    if (appointmentModel.ExpireAt > appointmentModel.RepeatUntil)
                    {
                        appointmentModel.RepeatUntil = appointmentModel.ExpireAt;
                    }

                    appointment.UpdatedAt = DateTime.UtcNow;
                    appointment.UpdatedByUserId = UserId;
                    appointment.ExpireAt = appointmentModel.ExpireAt;
                    appointment.StartAt = appointmentModel.StartAt;
                    appointment.Info = appointmentModel.Info;
                    appointment.Description = appointmentModel.Description;
                    appointment.Title = appointmentModel.Title;
                    appointment.ColorHex = appointmentModel.ColorHex;
                    appointment.RepeatEvery = appointmentModel.RepeatEvery;
                    appointment.RepeatType = appointmentModel.RepeatType;
                    appointment.RepeatUntil = appointmentModel.RepeatUntil;
                    appointment.SdkeFormId = appointmentModel.eFormId;

                    await appointment.Update(_dbContext);

                    var asToDelete = appointment.AppointmentSites
                        .Where(s => appointmentModel.SiteUids.All(x => x != s.MicrotingSiteUid));

                    foreach (var site in asToDelete)
                    {
                        await site.Delete(_dbContext);
                    }

                    var asToCreate = appointmentModel.SiteUids
                        .Where(s => appointment.AppointmentSites.All(x => x.MicrotingSiteUid != s));

                    foreach (var siteUid in asToCreate)
                    {
                        var appointmentSite = new Entities.AppointmentSite()
                        {
                            AppointmentId = appointment.Id,
                            MicrotingSiteUid = siteUid
                        };
                        await appointmentSite.Create(_dbContext);
                    }

                    var afToDelete = appointment.AppointmentPrefillFieldValues
                        .Where(f => appointmentModel.Fields.All(x => x.FieldId != f.FieldId));

                    foreach (var field in afToDelete)
                    {
                        await field.Delete(_dbContext);
                    }

                    var afToCreate = appointmentModel.Fields
                        .Where(f => appointment.AppointmentPrefillFieldValues.All(x => x.FieldId != f.FieldId));

                    foreach (var field in afToCreate)
                    {
                        var appointmentPrefillField = new Entities.AppointmentPrefillFieldValue()
                        {
                            AppointmentId = appointment.Id,
                            FieldId = field.FieldId,
                            FieldValue = field.FieldValue
                        };
                        await appointmentPrefillField.Create(_dbContext);
                    }

                    transaction.Commit();
                    return new OperationResult(
                        true,
                        _appointmentLocalizationService.GetString("AppointmentUpdatedSuccessfully"));
                }
                catch (Exception e)
                {
                    Trace.TraceError(e.Message);
                    transaction.Rollback();
                    return new OperationResult(
                        false,
                        _appointmentLocalizationService.GetString("ErrorWhileUpdatingAppointment"));
                }
            }
        }

        public async Task<OperationResult> Delete(int id)
        {
            using (var transaction = await _dbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    var appointment = await _dbContext.Appointments.FindAsync(id);

                    if (appointment.StartAt < DateTime.UtcNow)
                    {
                        return new OperationResult(
                            false,
                            _appointmentLocalizationService.GetString("CannotDeleteAppointment"));
                    }

                    foreach (var appointmentSite in appointment.AppointmentSites)
                    {
                        await appointmentSite.Delete(_dbContext);
                    }

                    foreach (var appointmentField in appointment.AppointmentPrefillFieldValues)
                    {
                        await appointmentField.Delete(_dbContext);
                    }

                    await appointment.Delete(_dbContext);

                    transaction.Commit();
                    return new OperationResult(
                        true,
                        _appointmentLocalizationService.GetString("AppointmentDeletedSuccessfully"));
                }
                catch (Exception e)
                {
                    Trace.TraceError(e.Message);
                    transaction.Rollback();
                    return new OperationResult(
                        false,
                        _appointmentLocalizationService.GetString("ErrorWhileDeletingAppointment"));
                }
            }
        }

        private int UserId
        {
            get
            {
                var value = _httpContextAccessor?.HttpContext.User?.FindFirstValue(ClaimTypes.NameIdentifier);
                return value == null ? 0 : int.Parse(value);
            }
        }
    }
}
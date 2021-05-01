using System;
using System.Diagnostics;
using System.Security.Claims;
using System.Threading.Tasks;
using Customers.Pn.Abstractions;
using Customers.Pn.Infrastructure.Models.Customer;
using Customers.Pn.Infrastructure.Models.Settings;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers.PluginDbOptions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormBaseCustomerBase.Infrastructure.Data;

namespace Customers.Pn.Services
{
    public class CustomersSettingsService : ICustomersSettingsService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILogger<CustomersSettingsService> _logger;
        private readonly CustomersPnDbAnySql _dbContext;
        private readonly ICustomersLocalizationService _customersLocalizationService;
        private readonly IPluginDbOptions<CustomersSettings> _options;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CustomersSettingsService(ILogger<CustomersSettingsService> logger,
            CustomersPnDbAnySql dbContext,
            IEFormCoreService coreHelper,
            ICustomersLocalizationService customersLocalizationService,
            IPluginDbOptions<CustomersSettings> options,
            IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _customersLocalizationService = customersLocalizationService;
            _options = options;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<OperationDataResult<CustomerSettingsModel>> GetSettings()
        {
            try
            {
                var result = new CustomerSettingsModel();
                var customerSettings = _options.Value;
                if (customerSettings?.RelatedEntityGroupId != null)
                {
                    result.RelatedEntityId = (int) customerSettings.RelatedEntityGroupId;
                    var core = _coreHelper.GetCore();
                    var entityGroup = await core.Result.EntityGroupRead(customerSettings.RelatedEntityGroupId.ToString());
                    if (entityGroup == null)
                    {
                        return new OperationDataResult<CustomerSettingsModel>(false, "Entity group not found");
                    }

                    result.RelatedEntityName = entityGroup.Name;
                }

                return new OperationDataResult<CustomerSettingsModel>(true, result);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<CustomerSettingsModel>(false,
                    _customersLocalizationService.GetString("ErrorObtainingCustomersInfo"));
            }
        }

        public async Task<OperationResult> UpdateSettings(CustomerSettingsModel customerSettingsModel)
        {
            try
            {
                if (customerSettingsModel.RelatedEntityId == 0)
                {
                    return new OperationDataResult<CustomersModel>(true);
                }

                var core = _coreHelper.GetCore();
                var newEntityGroup = await core.Result.EntityGroupRead(customerSettingsModel.RelatedEntityId.ToString());
                if (newEntityGroup == null)
                {
                    return new OperationResult(false, "Entity group not found");
                }

                var userId = UserId;
                await _options.UpdateDb(
                    x => { x.RelatedEntityGroupId = customerSettingsModel.RelatedEntityId; },
                    _dbContext,
                    userId);

                return new OperationDataResult<CustomersModel>(true,
                    _customersLocalizationService.GetString("SettingsUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.LogError(e.Message);
                return new OperationDataResult<CustomersModel>(false,
                    _customersLocalizationService.GetString("ErrorWhileUpdatingSettings"));
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
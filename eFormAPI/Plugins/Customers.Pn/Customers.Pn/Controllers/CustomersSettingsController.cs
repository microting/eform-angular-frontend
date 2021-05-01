using System.Threading.Tasks;
using Customers.Pn.Abstractions;
using Customers.Pn.Infrastructure.Models.Customer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace Customers.Pn.Controllers
{
    public class CustomersSettingsController : Controller
    {
        private readonly ICustomersSettingsService _customersSettingsService;

        public CustomersSettingsController(ICustomersSettingsService customersSettingsService)
        {
            _customersSettingsService = customersSettingsService;
        }
        
        [HttpGet]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/customers-pn/settings")]
        public async Task<OperationDataResult<CustomerSettingsModel>> GetSettings()
        {
            return await _customersSettingsService.GetSettings();
        }


        [HttpPost]
        [Authorize(Roles = EformRole.Admin)]
        [Route("api/customers-pn/settings")]
        public async Task<OperationResult> UpdateSettings([FromBody] CustomerSettingsModel customerUpdateModel)
        {
            return await _customersSettingsService.UpdateSettings(customerUpdateModel);
        }
    }
}

using System.Threading.Tasks;
using Customers.Pn.Abstractions;
using Customers.Pn.Infrastructure.Models.Customer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormBaseCustomerBase.Infrastructure.Const;

namespace Customers.Pn.Controllers
{
    [Authorize]
    [Route("api/customers-pn/customers")]
    public class CustomersController : Controller
    {
        private readonly ICustomersService _customersService;

        public CustomersController(ICustomersService customersService)
        {
            _customersService = customersService;
        }

        [HttpGet]
        [Route("")]
        public async Task<OperationDataResult<CustomersModel>> Index(CustomersRequestModel pnRequestModel)
        {
            return await _customersService.Index(pnRequestModel);
        }

        [HttpPost]
        [Route("")]
        [Authorize(Policy = CustomersClaims.CreateCustomers)]
        public async Task<OperationResult> Create([FromBody] CustomerFullModel customerPnCreateModel)
        {
            return await _customersService.Create(customerPnCreateModel);
        }

        [HttpGet]
        [Route("{id}")]
        public async Task<OperationDataResult<CustomerFullModel>> Read(int id)
        {
            return await _customersService.Read(id);
        }

        [HttpPut]
        [Route("")]
        public async Task<OperationResult> Update([FromBody] CustomerFullModel customerUpdateModel)
        {
            return await _customersService.Update(customerUpdateModel);
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<OperationResult> Delete(int id)
        {
            return await _customersService.Delete(id);
        }
                
        [HttpPost]
        [Route("import")]
        public async Task<OperationResult> ImportCustomer([FromBody] CustomerImportModel customerImportModel)
        {
            return await _customersService.ImportCustomers(customerImportModel);
        }

    }
}
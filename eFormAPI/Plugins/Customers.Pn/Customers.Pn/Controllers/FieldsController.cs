using System.Threading.Tasks;
using Customers.Pn.Abstractions;
using Customers.Pn.Infrastructure.Models.Fields;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormBaseCustomerBase.Infrastructure.Models.Fields;

namespace Customers.Pn.Controllers
{
    [Authorize]
    public class FieldsController : Controller
    {
        private readonly IFieldsService _fieldsService;

        public FieldsController(IFieldsService fieldsService)
        {
            _fieldsService = fieldsService;
        }

        [HttpGet]
        [Route("api/fields-pn")]
        public async Task<OperationDataResult<FieldsUpdateModel>> GetFields()
        {
            return await _fieldsService.GetFields();
        }

        [HttpPut]
        [Route("api/fields-pn")]
        public async Task<OperationResult> UpdateFields([FromBody] FieldsUpdateModel fieldsModel)
        {
            return await _fieldsService.UpdateFields(fieldsModel);
        }
    }
}
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Controllers
{
    [Authorize]
    public class InstallationController : Controller
    {
        private readonly IInstallationService _installationService;

        public InstallationController(IInstallationService installationService)
        {
            _installationService = installationService;
        }

        [HttpGet]
        [Route("api/trash-inspection-pn/installations")]
        public async Task<OperationDataResult<InstallationsModel>> Index(InstallationRequestModel requestModel)
        {
            return await _installationService.Index(requestModel);
        }

        [HttpPost]
        [Route("api/trash-inspection-pn/installations")]
        public async Task<OperationResult> Create([FromBody] InstallationModel createModel)
        {
            return await _installationService.Create(createModel);
        }
        
        [HttpGet]
        [Route("api/trash-inspection-pn/installations/{id}")]
        public async Task<OperationDataResult<InstallationModel>> Read(int id)
        {
            return await _installationService.Read(id);
        }


        [HttpPut]
        [Route("api/trash-inspection-pn/installations")]
        public async Task<OperationResult> Update([FromBody] InstallationModel updateModel)
        {
            return await _installationService.Update(updateModel);
        }

        [HttpDelete]
        [Route("api/trash-inspection-pn/installations/{id}")]
        public async Task<OperationResult> Delete(int id)
        {
            return await _installationService.Delete(id);
        }
    }
}

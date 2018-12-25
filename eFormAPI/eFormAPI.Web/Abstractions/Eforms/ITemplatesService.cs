using System.Threading.Tasks;
using eFormShared;
using Microting.eFormApi.BasePn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Templates;

namespace eFormAPI.Web.Abstractions.Eforms
{
    public interface ITemplatesService
    {
        OperationResult Create(EFormXmlModel eFormXmlModel);
        OperationResult Delete(int id);
        OperationResult Deploy(DeployModel deployModel);
        OperationDataResult<DeployToModel> DeployTo(int id);
        OperationDataResult<Template_Dto> Get(int id);
        Task<OperationDataResult<TemplateListModel>> Index(TemplateRequestModel templateRequestModel);
    }
}
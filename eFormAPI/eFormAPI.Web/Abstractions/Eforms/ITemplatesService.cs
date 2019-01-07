using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models;
using eFormAPI.Web.Infrastructure.Models.Templates;
using eFormShared;
using Microting.eFormApi.BasePn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

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
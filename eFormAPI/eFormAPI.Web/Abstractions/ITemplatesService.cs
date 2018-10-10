using eFormShared;
using Microting.eFormApi.BasePn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Templates;

namespace eFormAPI.Web.Abstractions
{
    public interface ITemplatesService
    {
        OperationResult Create(EFormXmlModel eFormXmlModel);
        OperationResult Delete(int id);
        OperationResult Deploy(DeployModel deployModel);
        OperationDataResult<DeployToModel> DeployTo(int id);
        OperationDataResult<Template_Dto> Get(int id);
        OperationDataResult<TemplateListModel> Index(TemplateRequestModel templateRequestModel);
    }
}
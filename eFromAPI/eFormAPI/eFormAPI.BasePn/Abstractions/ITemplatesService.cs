using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Models;
using eFormAPI.BasePn.Models.Templates;
using eFormShared;

namespace eFormAPI.BasePn.Abstractions
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
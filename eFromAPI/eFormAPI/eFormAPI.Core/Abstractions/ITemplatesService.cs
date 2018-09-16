using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models;
using eFormAPI.Common.Models.Templates;
using eFormShared;

namespace eFormAPI.Core.Abstractions
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
using System.Collections.Generic;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Templates;

namespace eFormAPI.Web.Abstractions
{
    public interface ITemplateColumnsService
    {
        OperationDataResult<List<TemplateColumnModel>> GetAvailableColumns(int templateId);
        OperationDataResult<DisplayTemplateColumnsModel> GetCurrentColumns(int templateId);
        OperationResult UpdateColumns(UpdateTemplateColumnsModel model);
    }
}
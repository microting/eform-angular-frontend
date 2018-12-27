using System.Collections.Generic;
using eFormAPI.Web.Infrastructure.Models.Templates;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions.Eforms
{
    public interface ITemplateColumnsService
    {
        OperationDataResult<List<TemplateColumnModel>> GetAvailableColumns(int templateId);
        OperationDataResult<DisplayTemplateColumnsModel> GetCurrentColumns(int templateId);
        OperationResult UpdateColumns(UpdateTemplateColumnsModel model);
    }
}
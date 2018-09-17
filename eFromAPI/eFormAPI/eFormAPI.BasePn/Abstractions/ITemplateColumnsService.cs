using System.Collections.Generic;
using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Models.Templates;

namespace eFormAPI.BasePn.Abstractions
{
    public interface ITemplateColumnsService
    {
        OperationDataResult<List<TemplateColumnModel>> GetAvailableColumns(int templateId);
        OperationDataResult<DisplayTemplateColumnsModel> GetCurrentColumns(int templateId);
        OperationResult UpdateColumns(UpdateTemplateColumnsModel model);
    }
}
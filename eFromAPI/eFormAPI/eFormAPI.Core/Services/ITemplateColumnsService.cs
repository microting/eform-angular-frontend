using System.Collections.Generic;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Templates;

namespace eFormAPI.Core.Services
{
    public interface ITemplateColumnsService
    {
        OperationDataResult<List<TemplateColumnModel>> GetAvailableColumns(int templateId);
        OperationDataResult<DisplayTemplateColumnsModel> GetCurrentColumns(int templateId);
        OperationResult UpdateColumns(UpdateTemplateColumnsModel model);
    }
}
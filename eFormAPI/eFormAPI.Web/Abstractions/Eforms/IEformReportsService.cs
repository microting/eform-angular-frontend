using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Models.Reports;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Abstractions.Eforms
{
    public interface IEformReportsService
    {
        Task<OperationDataResult<EformReportFullModel>> GetEformReport(int templateId);
        Task<OperationResult> UpdateEformReport(EformReportModel requestModel);
    }
}
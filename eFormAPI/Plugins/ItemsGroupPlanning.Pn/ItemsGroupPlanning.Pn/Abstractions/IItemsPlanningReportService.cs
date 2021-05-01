namespace ItemsGroupPlanning.Pn.Abstractions
{
    using System.Threading.Tasks;
    using Infrastructure.Models;
    using Infrastructure.Models.Report;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;

    public interface IItemsPlanningReportService
    {
        Task<OperationDataResult<ReportModel>> GenerateReport(GenerateReportModel model);
        Task<OperationDataResult<FileStreamModel>> GenerateReportFile(GenerateReportModel model);
    }
}

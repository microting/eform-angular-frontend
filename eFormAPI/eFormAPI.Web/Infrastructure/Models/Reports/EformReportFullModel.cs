using eFormData;

namespace eFormAPI.Web.Infrastructure.Models.Reports
{
    public class EformReportFullModel
    {
        public MainElement EformMainElement { get; set; } = new MainElement();
        public EformReportModel EformReport { get; set; } = new EformReportModel();
    }
}
using eFormData;

namespace eFormAPI.Web.Infrastructure.Models.Reports
{
    public class EformReportFullModel
    {
        public EformMainElement EformMainElement { get; set; } = new EformMainElement();
        public EformReportModel EformReport { get; set; } = new EformReportModel();
    }
}
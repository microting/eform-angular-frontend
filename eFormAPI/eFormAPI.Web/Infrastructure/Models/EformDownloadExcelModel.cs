using System;

namespace eFormAPI.Web.Infrastructure.Models;

public class EformDownloadExcelModel
{
    public int TemplateId { get; set; }
    public DateTime DateFrom { get; set; }
    public DateTime DateTo { get; set; }
}
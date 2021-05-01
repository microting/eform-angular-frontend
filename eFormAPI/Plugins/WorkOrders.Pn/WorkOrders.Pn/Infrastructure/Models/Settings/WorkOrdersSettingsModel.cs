using System.Collections.Generic;

namespace WorkOrders.Pn.Infrastructure.Models.Settings
{
    public class WorkOrdersSettingsModel
    {
        public int? FolderId { get; set; }
        public int? FolderTasksId { get; set; }
        public List<SiteNameModel> AssignedSites { get; set; } = new List<SiteNameModel>();
    }
}

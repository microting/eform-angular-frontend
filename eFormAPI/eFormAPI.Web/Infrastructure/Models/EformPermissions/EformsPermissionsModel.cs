using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.EformPermissions
{
    public class EformsPermissionsModel
    {
        public int Total { get; set; }
        public int GroupId { get; set; }
        public string GroupName { get; set; }

        public List<EformPermissionsModel> EformsList { get; set; }
            = new List<EformPermissionsModel>();
    }
}
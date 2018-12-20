using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Permissions
{
    public class PermissionsUpdateModel
    {
        public int GroupId { get; set; }

        public List<PermissionModel> Permissions { get; set; }
            = new List<PermissionModel>();
    }
}
using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Permissions
{
    public class PermissionsModel
    {
        public int GroupId { get; set; }

        public List<PermissionTypeModel> PermissionTypes { get; set; }
            = new List<PermissionTypeModel>();
    }
}
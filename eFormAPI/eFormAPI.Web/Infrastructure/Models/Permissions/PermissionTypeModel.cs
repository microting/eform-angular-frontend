using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Permissions
{
    public class PermissionTypeModel
    {
        public string Name { get; set; }

        public List<PermissionModel> Permissions { get; set; }
            = new List<PermissionModel>();
    }
}
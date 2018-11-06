using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.EformPermissions
{
    public class EformPermissionTypeModel
    {
        public string Name { get; set; }

        public List<EformPermissionModel> Permissions { get; set; }
            = new List<EformPermissionModel>();
    }
}
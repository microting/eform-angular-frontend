using System;
using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.EformPermissions
{
    public class EformPermissionsModel
    {
        public string GroupName { get; set; }
        public int EformInGroupId { get; set; }
        public int TemplateId { get; set; }
        public string Label { get; set; }
        public DateTime? CreatedAt { get; set; }

        public List<EformPermissionModel> Permissions { get; set; }
            = new List<EformPermissionModel>();

        public List<EformPermissionTypeModel> PermissionTypes { get; set; }
            = new List<EformPermissionTypeModel>();
    }
}
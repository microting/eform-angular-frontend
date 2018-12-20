using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.EformPermissions
{
    public class EformPermissionsSimpleModel
    {
        public int TemplateId { get; set; }

        public List<string> PermissionsSimpleList { get; set; }
            = new List<string>();
    }
}
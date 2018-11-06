using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Permissions
{
    public class SecurityGroupsModel
    {
        public int? Total { get; set; }

        public List<SecurityGroupModel> SecurityGroupList { get; set; }
            = new List<SecurityGroupModel>();
    }
}
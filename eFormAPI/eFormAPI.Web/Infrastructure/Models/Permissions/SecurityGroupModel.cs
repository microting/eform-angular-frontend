using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Permissions
{
    public class SecurityGroupModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int UserAmount { get; set; }

        public List<SecurityGroupUserModel> UsersList { get; set; }
            = new List<SecurityGroupUserModel>();
    }
}
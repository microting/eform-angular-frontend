using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Permissions
{
    public class SecurityGroupUpdateModel
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<int> UserIds { get; set; }
            = new List<int>();
    }
}
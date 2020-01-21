using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Sites
{
    public class SiteUpdateModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<int> TagIds { get; set; }
            = new List<int>();
    }
}

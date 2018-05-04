using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Tags
{
    public class UpdateEformTagsModel
    {
        public int EformId { get; set; }
        public List<int> TagsIds { get; set; } = new List<int>();
    }
}
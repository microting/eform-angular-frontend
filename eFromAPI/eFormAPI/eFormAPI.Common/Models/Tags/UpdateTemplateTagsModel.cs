using System.Collections.Generic;

namespace eFormAPI.Common.Models.Tags
{
    public class UpdateTemplateTagsModel
    {
        public int TemplateId { get; set; }
        public List<int> TagsIds { get; set; } = new List<int>();
    }
}
using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Tags
{
    public class SavedTagsModel
    {
        public List<SavedTagModel> TagList { get; set; }
            = new List<SavedTagModel>();
    }
}
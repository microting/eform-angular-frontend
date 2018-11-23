using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace eFormAPI.Web.Infrastructure.Models.Tags
{
    public class SavedTagsModel
    {
        public List<SavedTagModel> TagList { get; set; }
            = new List<SavedTagModel>();
    }
}

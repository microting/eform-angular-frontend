using System.Collections.Generic;
using eFormData;

namespace eFromAPI.Common.Models.SearchableList
{
    public class AdvEntityGroupEditModel
    {
        public string Name { get; set; }
        public string GroupUid { get; set; }
        public List<EntityItem> AdvEntityItemModels { get; set; }
    }
}

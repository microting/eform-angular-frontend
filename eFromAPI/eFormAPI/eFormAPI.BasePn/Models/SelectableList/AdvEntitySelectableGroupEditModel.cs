using System.Collections.Generic;
using eFormData;

namespace eFormAPI.BasePn.Models.SelectableList
{
    public class AdvEntitySelectableGroupEditModel
    {
        public string Name { get; set; }
        public string GroupUid { get; set; }
        public List<EntityItem> AdvEntitySelectableItemModels { get; set; }
    }
}
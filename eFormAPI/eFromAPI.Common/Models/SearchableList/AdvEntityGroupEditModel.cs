using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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

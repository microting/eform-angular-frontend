using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;

namespace eFormAPI.Web.Infrastructure.Database.Entities
{
    public class MenuItem : BaseEntity
    {
        [StringLength(250)] 
        public string Name { get; set; }
        public string Link { get; set; }
        public string E2EId { get; set; }

        public int Position { get; set; }
        public int MenuPosition { get; set; } // 1 = Left, 0 = Right

        public int? ParentId { get; set; }
        public MenuItem Parent { get; set; }

        public List<MenuItem> ChildItems
            = new List<MenuItem>();
    }
}
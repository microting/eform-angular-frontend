using System.Collections.Generic;
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;

namespace eFormAPI.Web.Infrastructure.Database.Entities
{
    public class EformInGroup : BaseEntity
    {
        public int TemplateId { get; set; }

        public int SecurityGroupId { get; set; }
        public virtual SecurityGroup SecurityGroup { get; set; }

        public virtual List<EformPermission> EformPermissions { get; set; } 
            = new List<EformPermission>();
    }
}
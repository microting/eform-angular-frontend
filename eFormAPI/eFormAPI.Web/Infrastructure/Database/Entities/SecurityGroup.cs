using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;

namespace eFormAPI.Web.Infrastructure.Database.Entities
{
    public class SecurityGroup : BaseEntity
    {
        [StringLength(250)] 
        public string Name { get; set; }

        public ICollection<SecurityGroupUser> SecurityGroupUsers { get; set; }
            = new List<SecurityGroupUser>();
    }


    public class EformPermission : BaseEntity
    {
        public int EformInGroupId { get; set; }
    }

    public class EformInGroup : BaseEntity
    {
        public int TemplateId { get; set; }

        public int SecurityGroupId { get; set; }
        public SecurityGroup SecurityGroup { get; set; }
    }


}
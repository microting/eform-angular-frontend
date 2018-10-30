using Microting.eFormApi.BasePn.Infrastructure.Database.Base;

namespace eFormAPI.Web.Infrastructure.Database.Entities
{
    public class EformInGroup : BaseEntity
    {
        public int TemplateId { get; set; }

        public int SecurityGroupId { get; set; }
        public SecurityGroup SecurityGroup { get; set; }
    }
}
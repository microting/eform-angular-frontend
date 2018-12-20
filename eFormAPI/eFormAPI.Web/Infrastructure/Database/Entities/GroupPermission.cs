using Microting.eFormApi.BasePn.Infrastructure.Database.Base;

namespace eFormAPI.Web.Infrastructure.Database.Entities
{
    public class GroupPermission : BaseEntity
    {
        public int PermissionId { get; set; }
        public virtual Permission Permission { get; set; }

        public int SecurityGroupId { get; set; }
        public virtual SecurityGroup SecurityGroup { get; set; }
    }
}
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;

namespace eFormAPI.Web.Infrastructure.Database.Entities
{
    public class EformPermission : BaseEntity
    {
        public int PermissionId { get; set; }
        public virtual Permission Permission { get; set; }

        public int EformInGroupId { get; set; }
        public virtual EformInGroup EformInGroup { get; set; }

    }
}
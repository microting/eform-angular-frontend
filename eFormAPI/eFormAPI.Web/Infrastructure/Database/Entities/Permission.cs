using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;

namespace eFormAPI.Web.Infrastructure.Database.Entities
{
    public class Permission : BaseEntity
    {
        [StringLength(250)] 
        public string PermissionName { get; set; }
        [StringLength(250)] 
        public string ClaimName { get; set; }

        public int PermissionTypeId { get; set; }
        public PermissionType PermissionType { get; set; }

        public ICollection<GroupPermission> GroupPermissions
            = new List<GroupPermission>();
    }
}
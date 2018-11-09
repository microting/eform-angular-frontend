using System.ComponentModel.DataAnnotations;
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;

namespace eFormAPI.Web.Infrastructure.Database.Entities
{
    public class PermissionType : BaseEntity
    {
        [StringLength(250)] 
        public string Name { get; set; }
    }
}
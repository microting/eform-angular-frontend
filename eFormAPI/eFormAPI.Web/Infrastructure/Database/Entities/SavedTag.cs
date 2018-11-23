using System.ComponentModel.DataAnnotations;
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace eFormAPI.Web.Infrastructure.Database.Entities
{
    public class SavedTag : BaseEntity
    {
        public int TagId { get; set; }

        [StringLength(250)]
        public string TagName { get; set; }

        public int EformUserId { get; set; }
        public EformUser EformUser { get; set; }
    }
}
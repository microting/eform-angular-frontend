using System.ComponentModel.DataAnnotations;
using eFormAPI.Web.Hosting.Enums;
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;

namespace eFormAPI.Web.Infrastructure.Database.Entities
{
    public class EformPlugin : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string PluginId { get; set; }

        public string ConnectionString { get; set; }

        public int Status { get; set; }
    }
}
using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.Templates
{
    public class DeployModel
    {
        public int Id { get; set; }
        public List<DeployCheckbox> DeployCheckboxes;
    }
}
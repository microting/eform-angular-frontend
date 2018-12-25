using System.Collections.Generic;

namespace Microting.eFormApi.BasePn.Infrastructure.Models.Templates
{
    public class DeployModel
    {
        public int Id { get; set; }
        public List<DeployCheckbox> DeployCheckboxes;
    }
}
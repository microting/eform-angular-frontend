using System.Collections.Generic;

namespace eFormAPI.Common.Models.Templates
{
    public class DeployModel
    {
        public int Id { get; set; }
        public List<DeployCheckbox> DeployCheckboxes;
    }
}
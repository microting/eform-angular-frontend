using System.Collections.Generic;

namespace eFormAPI.Common.Models
{
    public class DeployModel
    {
        public int Id { get; set; }
        public List<DeployCheckbox> DeployCheckboxes;
    }
}
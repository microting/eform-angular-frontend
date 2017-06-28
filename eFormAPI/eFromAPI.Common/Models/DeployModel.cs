using System.Collections.Generic;

namespace eFromAPI.Common.Models
{
    public class DeployModel
    {
        public int Id { get; set; }
        public List<DeployCheckbox> DeployCheckboxes;
    }
}
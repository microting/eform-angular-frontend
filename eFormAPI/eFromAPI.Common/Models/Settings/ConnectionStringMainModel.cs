using System.ComponentModel.DataAnnotations;

namespace eFromAPI.Common.Models.Settings
{
    public class ConnectionStringMainModel
    {
        [Required]
        public string Source { get; set; }
        [Required]
        public string Catalogue { get; set; }
        [Required]
        public string Auth { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace eFormAPI.BasePn.Models.Settings.Initial
{
    public class ConnectionStringMainModel
    {
        [Required] public string Source { get; set; }
        [Required] public string Catalogue { get; set; }
        [Required] public string Auth { get; set; }
    }
}
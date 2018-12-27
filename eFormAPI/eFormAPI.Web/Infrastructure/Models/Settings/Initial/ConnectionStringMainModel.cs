using System.ComponentModel.DataAnnotations;

namespace eFormAPI.Web.Infrastructure.Models.Settings.Initial
{
    public class ConnectionStringMainModel
    {
        [Required] public string Source { get; set; }
        [Required] public string Catalogue { get; set; }
        [Required] public string Auth { get; set; }
        [Required] public int Port { get; set; }
    }
}
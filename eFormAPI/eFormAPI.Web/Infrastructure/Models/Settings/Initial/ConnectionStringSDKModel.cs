using System.ComponentModel.DataAnnotations;

namespace Microting.eFormApi.BasePn.Infrastructure.Models.Settings.Initial
{
    public class ConnectionStringSDKModel
    {
        [Required] public string Host { get; set; }
        [Required] public string Database { get; set; }
        [Required] public string Auth { get; set; }
        [Required] public string Token { get; set; }
        [Required] public int Port { get; set; }
        [Required] public string SqlServerType { get; set; }
        [Required] public bool PrefixAllDatabases { get; set; }
    }
}
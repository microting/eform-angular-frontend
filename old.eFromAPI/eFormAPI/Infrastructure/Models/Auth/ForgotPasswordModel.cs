using System.ComponentModel.DataAnnotations;

namespace eFormAPI.Web.Infrastructure.Models.Auth
{
    public class ForgotPasswordModel
    {
        [Required]
        public string Email { get; set; }
    }
}

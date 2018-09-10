using System.ComponentModel.DataAnnotations;

namespace eFormAPI.Common.Models.Auth
{
    public class ForgotPasswordModel
    {
        [Required]
        public string Email { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace eFromAPI.Common.Models.Auth
{
    public class ForgotPasswordModel
    {
        [Required]
        public string Email { get; set; }
    }
}

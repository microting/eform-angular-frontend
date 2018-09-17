using System.ComponentModel.DataAnnotations;

namespace eFormAPI.BasePn.Models.Auth
{
    public class ForgotPasswordModel
    {
        [Required] public string Email { get; set; }
    }
}
namespace eFormAPI.Web.Infrastructure.Models;

public class ResetPasswordModel
{
    public int UserId { get; set; }
    public string NewPassword { get; set; }
    public string NewConfirmPassword { get; set; }
    public string Code { get; set; }
}
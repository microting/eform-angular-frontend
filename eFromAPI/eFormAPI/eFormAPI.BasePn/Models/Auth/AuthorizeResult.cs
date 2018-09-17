namespace eFormAPI.BasePn.Models.Auth
{
    public class AuthorizeResult
    {
        public int Id { get; set; }
        public string role { get; set; }
        public string access_token { get; set; }
        public string token_type { get; set; }
        public string expires_in { get; set; }
        public string userName { get; set; }
    }
}
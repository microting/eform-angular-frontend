using System;

namespace eFormAPI.BasePn.Models.User
{
    public class UserInfoViewModel
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string UserName { get; set; }
    }
}
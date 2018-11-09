using System;

namespace eFormAPI.Web.Infrastructure.Models.Users
{
    public class UserInfoViewModel
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string GroupName { get; set; }
        public string UserName { get; set; }
    }
}
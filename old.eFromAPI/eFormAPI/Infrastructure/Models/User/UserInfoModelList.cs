using System.Collections.Generic;

namespace eFormAPI.Web.Infrastructure.Models.User
{
    public class UserInfoModelList
    {
        public int TotalUsers { get; set; }
        public List<UserInfoViewModel> UserList { get; set; }

        public UserInfoModelList()
        {
            UserList = new List<UserInfoViewModel>();
        }
    }
}
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace eFormAPI.Database.Entities
{
    public class EformUser : IdentityUser<int>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string Locale { get; set; }

        public bool IsGoogleAuthenticatorEnabled { get; set; }
        public string GoogleAuthenticatorSecretKey { get; set; }

        public ICollection<EformUserRole> UserRoles { get; set; }
    }
}
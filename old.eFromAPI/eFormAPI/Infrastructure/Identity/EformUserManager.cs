using System;
using eFormAPI.Web.Infrastructure.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;

namespace eFormAPI.Web.Infrastructure.Identity
{
    public class EformUserManager : UserManager<EformUser, int>
    {
        public EformUserManager(IUserStore<EformUser, int> store)
            : base(store)
        {
        }

        public static EformUserManager Create(IdentityFactoryOptions<EformUserManager> options, IOwinContext context)
        {
            var appDbContext = context.Get<BaseDbContext>();
            var appUserManager = new EformUserManager(new EformUserStore(appDbContext));

            // Configure validation logic for usernames
            appUserManager.UserValidator = new UserValidator<EformUser, int>(appUserManager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };

            // Configure validation logic for passwords
            appUserManager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = false,
                RequireDigit = false,
                RequireLowercase = false,
                RequireUppercase = false,
            };

            appUserManager.EmailService = new EmailService();

            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                appUserManager.UserTokenProvider =
                    new DataProtectorTokenProvider<EformUser, int>(
                        dataProtectionProvider.Create("ASP.NET Identity"))
                    {
                        //Code for email confirmation and reset password life time
                        TokenLifespan = TimeSpan.FromHours(10)
                    };
            }
            return appUserManager;
        }
    }
}
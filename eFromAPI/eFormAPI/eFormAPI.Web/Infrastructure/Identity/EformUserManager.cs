//using System;
//using System.Collections.Generic;
//using eFormAPI.Common.Infrastructure.Data;
//using eFormAPI.Common.Infrastructure.Data.Entities;
//using eFormAPI.Web.Infrastructure.Services;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.Extensions.Logging;
//using Microsoft.Extensions.Options;

//namespace eFormAPI.Web.Infrastructure.Identity
//{
//    public class EformUserManager : UserManager<EformUser>
//    {

//        //public static EformUserManager Create(IdentityFactoryOptions<EformUserManager> options, IOwinContext context)
//        //{
//        //    var appDbContext = context.Get<BaseDbContext>();
//        //    var appUserManager = new EformUserManager(new EformUserStore(appDbContext));

//        //    // Configure validation logic for usernames
//        //    appUserManager.UserValidator = new UserValidator<EformUser, int>(appUserManager)
//        //    {
//        //        AllowOnlyAlphanumericUserNames = false,
//        //        RequireUniqueEmail = true
//        //    };

//        //    // Configure validation logic for passwords
//        //    appUserManager.PasswordValidator = new PasswordValidator<>
//        //    {
//        //        RequiredLength = 6,
//        //        RequireNonLetterOrDigit = false,
//        //        RequireDigit = false,
//        //        RequireLowercase = false,
//        //        RequireUppercase = false,
//        //    };

//        //    appUserManager.EmailService = new EmailService();

//        //    var dataProtectionProvider = options.DataProtectionProvider;
//        //    if (dataProtectionProvider != null)
//        //    {
//        //        appUserManager.UserTokenProvider =
//        //            new DataProtectorTokenProvider<EformUser, int>(
//        //                dataProtectionProvider.Create("ASP.NET Identity"))
//        //            {
//        //                //Code for email confirmation and reset password life time
//        //                TokenLifespan = TimeSpan.FromHours(10)
//        //            };
//        //    }
//        //    return appUserManager;
//        //}
//        public EformUserManager(IUserStore<EformUser> store, IOptions<IdentityOptions> optionsAccessor, IPasswordHasher<EformUser> passwordHasher, IEnumerable<IUserValidator<EformUser>> userValidators, IEnumerable<IPasswordValidator<EformUser>> passwordValidators, ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors, IServiceProvider services, ILogger<UserManager<EformUser>> logger) : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
//        {
//        }
//    }
//}
/*
The MIT License (MIT)
Copyright (c) 2007 - 2021 Microting A/S
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

namespace eFormAPI.Web.Hosting.Helpers;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure.Models.Settings.Initial;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using Microting.eFormApi.BasePn.Infrastructure.Consts;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

public static class SeedAdminHelper
{
    public static async Task SeedAdmin(AdminSetupModel adminSetupModel, string defaultLocale, BaseDbContext dbContext)
    {
        var userStore = new UserStore<EformUser,
            EformRole,
            BaseDbContext,
            int,
            IdentityUserClaim<int>,
            EformUserRole,
            IdentityUserLogin<int>,
            IdentityUserToken<int>,
            IdentityRoleClaim<int>>(dbContext);

        IPasswordHasher<EformUser> hasher = new PasswordHasher<EformUser>();
        var validator = new UserValidator<EformUser>();
        var validators = new List<UserValidator<EformUser>> { validator };
        var userManager = new UserManager<EformUser>(userStore, null, hasher, validators, null, null, null,
            null, null);

        // Set-up token providers.
        IUserTwoFactorTokenProvider<EformUser> tokenProvider = new EmailTokenProvider<EformUser>();
        userManager.RegisterTokenProvider("Default", tokenProvider);
        IUserTwoFactorTokenProvider<EformUser> phoneTokenProvider =
            new PhoneNumberTokenProvider<EformUser>();
        userManager.RegisterTokenProvider("PhoneTokenProvider", phoneTokenProvider);

        // Roles
        var roleStore = new RoleStore<EformRole, BaseDbContext, int>(dbContext);
        var roleManager = new RoleManager<EformRole>(roleStore, null, null, null, null);
        if (!await roleManager.RoleExistsAsync(EformRole.Admin))
        {
            await roleManager.CreateAsync(new EformRole { Name = EformRole.Admin });
        }
        if (!await roleManager.RoleExistsAsync(EformRole.User))
        {
            await roleManager.CreateAsync(new EformRole { Name = EformRole.User });
        }

        // Seed admin and demo users
        var timeZoneString = "Europe/Copenhagen";
        try
        {
            TimeZoneInfo.FindSystemTimeZoneById(timeZoneString);
        }
        catch
        {
            timeZoneString = "E. Europe Standard Time";
        }
        var adminUser = new EformUser
        {
            UserName = adminSetupModel.Email,
            Email = adminSetupModel.Email,
            FirstName = adminSetupModel.FirstName,
            LastName = adminSetupModel.LastName,
            Locale = string.IsNullOrEmpty(defaultLocale) ? LocaleNames.English : defaultLocale,
            TimeZone = timeZoneString,
            DarkTheme = true,
            Formats = LocaleNames.German,
            EmailConfirmed = true,
            TwoFactorEnabled = false,
            IsGoogleAuthenticatorEnabled = false
        };
        if (!userManager.Users.Any(x => x.Email.Equals(adminUser.Email)))
        {
            var createResult = await userManager.CreateAsync(adminUser,
                adminSetupModel.Password);
            if (!createResult.Succeeded)
            {
                throw new Exception("Could not create the user");
            }
        }

        var user = userManager.Users.FirstOrDefault(x => x.Email.Equals(adminUser.Email));
        if (!await userManager.IsInRoleAsync(user, EformRole.Admin))
        {
            await userManager.AddToRoleAsync(user, EformRole.Admin);
        }
    }
}
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

using System.Collections.Generic;

namespace eFormAPI.Web.Services;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Consts;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.EformAngularFrontendBase.Infrastructure.Data;

public class UserService(
    BaseDbContext dbContext,
    UserManager<EformUser> userManager,
    IHttpContextAccessor httpAccessor,
    IEFormCoreService coreHelper)
    : IUserService
{
    public async Task<EformUser> GetByIdAsync(int id)
    {
        return await dbContext.Users.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<EformUser> GetByUsernameAsync(string username)
    {
        return await dbContext.Users.FirstOrDefaultAsync(x => x.UserName == username);
    }

    public int UserId
    {
        get
        {
            var value = httpAccessor?.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
            return value == null ? 0 : int.Parse(value);
        }
    }

    public string Role => httpAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Role);

    public bool IsInRole(string role) => httpAccessor.HttpContext.User.IsInRole(role);

    public bool IsAdmin()
    {
        return IsInRole(EformRole.Admin);
    }

    public async Task<EformUser> GetCurrentUserAsync()
    {
        return await dbContext.Users.FirstOrDefaultAsync(x => x.Id == UserId);
    }

    public async Task<TimeZoneInfo> GetCurrentUserTimeZoneInfo()
    {
        if (UserId < 1)
        {
            throw new Exception("User not authorized!");
        }

        return await GetTimeZoneInfo(UserId);
    }

    public async Task<TimeZoneInfo> GetTimeZoneInfo(int userId)
    {

        var timeZone = await dbContext.Users
            .AsNoTracking()
            .Where(x => x.Id == userId)
            .Select(x => x.TimeZone)
            .FirstOrDefaultAsync();

        if (string.IsNullOrEmpty(timeZone))
        {
            timeZone = "Europe/Copenhagen";
        }

        TimeZoneInfo timeZoneInfo;
        try
        {
            timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById(timeZone);
        }
        catch
        {
            timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("E. Europe Standard Time");
        }

        return timeZoneInfo;
    }

    public async Task<string> GetCurrentUserLocale()
    {
        if (UserId < 1)
        {
            throw new Exception("User not authorized!");
        }

        return await GetUserLocale(UserId);
    }

    public async Task<string> GetUserLocale(int userId)
    {
        var locale = await dbContext.Users
            .AsNoTracking()
            .Where(x => x.Id == userId)
            .Select(x => x.Locale)
            .FirstOrDefaultAsync();

        if (string.IsNullOrEmpty(locale))
        {
            locale = LocaleNames.Danish;
        }

        return locale;
    }

    public async Task<string> GetCurrentUserFormats()
    {
        if (UserId < 1)
        {
            throw new Exception("User not authorized!");
        }

        return await GetUserFormats(UserId);
    }

    public async Task<string> GetUserFormats(int userId)
    {
        var formats = await dbContext.Users
            .AsNoTracking()
            .Where(x => x.Id == userId)
            .Select(x => x.Formats)
            .FirstOrDefaultAsync();

        if (string.IsNullOrEmpty(formats))
        {
            formats = "";
        }

        return formats;
    }

    public Task AddPasswordAsync(EformUser user, string password)
    {
        return userManager.AddPasswordAsync(user, password);
    }

    public async Task AddToRoleAsync(EformUser user, string role)
    {
        if (!await userManager.IsInRoleAsync(user, role))
        {
            await userManager.AddToRoleAsync(user, role);
        }
    }

    public async Task<string> GetFullNameUserByUserIdAsync(int userId)
    {
        return await dbContext.Users
            .AsNoTracking()
            .Where(x => x.Id == userId)
            .Select(x => $"{x.FirstName} {x.LastName}")
            .FirstOrDefaultAsync();
    }

    public async Task<string> GetCurrentUserFullName()
    {
        if (UserId < 1)
        {
            throw new Exception("User not authorized!");
        }

        return await GetFullNameUserByUserIdAsync(UserId);
    }

    public async Task<Language> GetLanguageByUserIdAsync(int userId)
    {
        var core = await coreHelper.GetCore();
        var locale = await GetUserLocale(userId);
        var sdkDbContext = core.DbContextHelper.GetDbContext();
        var language = await sdkDbContext.Languages
            .AsNoTracking()
            .Where(x => x.LanguageCode.ToLower() == locale.ToLower())
            .FirstAsync();

        return language;
    }

    public async Task<int> GetFirstUserIdInDb()
    {
        return await dbContext.Users
            .AsNoTracking()
            .Select(x => x.Id)
            .FirstOrDefaultAsync();
    }

    public async Task<Language> GetCurrentUserLanguage()
    {
        if (UserId < 1)
        {
            throw new Exception("User not authorized!");
        }

        return await GetLanguageByUserIdAsync(UserId);
    }

    public async Task<List<Language>> GetActiveLanguages()
    {
        var core = await coreHelper.GetCore();
        var sdkDbContext = core.DbContextHelper.GetDbContext();
        var languages = await sdkDbContext.Languages
            .AsNoTracking()
            .Where(x => x.IsActive == true)
            .ToListAsync();

        return languages;
    }
}
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
using System;

namespace eFormAPI.Web.Infrastructure.Models.Users;

public class UserInfoViewModel
{
    public int Id { get; set; }
    public DateTime CreatedDate { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
    public string GroupName { get; set; }
    public string UserName { get; set; }
    public string Language { get; set; }
    public string Formats { get; set; }
    public string TimeZone { get; set; }
    public bool DarkTheme { get; set; }
    public string ThemeVariant { get; set; }
    public bool IsDeviceUser { get; set; }
    public bool EmailConfirmed { get; set; }

    /// <summary>
    /// Whether this account may log in at all. Checked by AuthService's authenticate path, so
    /// a false value means the account exists and is administrable but cannot sign in.
    ///
    /// Exposed for the my.microting.com link dialog, which otherwise walks an administrator
    /// through a full identity confirmation against an account that can never use the
    /// password it is about to be given.
    /// </summary>
    public bool IsActive { get; set; }
    public string ArchiveSoftwareVersion { get; set; }
    public string ArchiveModel { get; set; }
    public string ArchiveManufacturer { get; set; }
    public string ArchiveOsVersion { get; set; }
    public string TimeRegistrationSoftwareVersion { get; set; }
    public string TimeRegistrationModel { get; set; }
    public string TimeRegistrationManufacturer { get; set; }
    public string TimeRegistrationOsVersion { get; set; }
    public string ProfilePicture { get; set; }
    public string ProfilePictureSnapshot { get; set; }
    public string EmailSha256 { get; set; }
}
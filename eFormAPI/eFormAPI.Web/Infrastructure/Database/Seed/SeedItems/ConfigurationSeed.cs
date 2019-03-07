/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 microting

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
using eFormAPI.Web.Infrastructure.Database.Entities;
using Microsoft.EntityFrameworkCore;

namespace eFormAPI.Web.Infrastructure.Database.Seed.SeedItems
{
    public static class ConfigurationSeed
    {
        public static EformConfigurationValue[] Data => new[]
        {
            new EformConfigurationValue()
            {
                Id = "ConnectionStringsSdk:SdkConnection",
                Value = ""
            },
            new EformConfigurationValue()
            {
                Id = "ApplicationSettings:DefaultLocale",
                Value = "en-US"
            },
            new EformConfigurationValue()
            {
                Id = "ApplicationSettings:SiteLink",
                Value = ""
            },
            new EformConfigurationValue()
            {
                Id = "ApplicationSettings:SecurityCode",
                Value = "code"
            },
            new EformConfigurationValue()
            {
                Id = "ApplicationSettings:DefaultPassword",
                Value = "Qq1234567$"
            },
            new EformConfigurationValue()
            {
                Id = "ApplicationSettings:IsTwoFactorForced",
                Value = "false"
            },
            new EformConfigurationValue()
            {
                Id = "EmailSettings:SmtpHost",
                Value = ""
            },
            new EformConfigurationValue()
            {
                Id = "EmailSettings:SmtpPort",
                Value = "25"
            },
            new EformConfigurationValue()
            {
                Id = "EmailSettings:Login",
                Value = ""
            },
            new EformConfigurationValue()
            {
                Id = "EmailSettings:Password",
                Value = ""
            },
            new EformConfigurationValue()
            {
                Id = "LoginPageSettings:MainText",
                Value = "Microting eForm"
            },
            new EformConfigurationValue()
            {
                Id = "LoginPageSettings:MainTextVisible",
                Value = "true"
            },
            new EformConfigurationValue()
            {
                Id = "LoginPageSettings:SecondaryText",
                Value = "No more paper-forms and back-office data entry"
            },
            new EformConfigurationValue()
            {
                Id = "LoginPageSettings:SecondaryTextVisible",
                Value = "true"
            },
            new EformConfigurationValue()
            {
                Id = "LoginPageSettings:ImageLink",
                Value = ""
            },
            new EformConfigurationValue()
            {
                Id = "LoginPageSettings:ImageLinkVisible",
                Value = "true"
            },
            new EformConfigurationValue()
            {
                Id = "HeaderSettings:MainText",
                Value = "Microting eForm"
            },
            new EformConfigurationValue()
            {
                Id = "HeaderSettings:MainTextVisible",
                Value = "true"
            },
            new EformConfigurationValue()
            {
                Id = "HeaderSettings:SecondaryText",
                Value = "No more paper-forms and back-office data entry"
            },
            new EformConfigurationValue()
            {
                Id = "HeaderSettings:SecondaryTextVisible",
                Value = "true"
            },
            new EformConfigurationValue()
            {
                Id = "HeaderSettings:ImageLink",
                Value = ""
            },
            new EformConfigurationValue()
            {
                Id = "HeaderSettings:ImageLinkVisible",
                Value = "true"
            },
            new EformConfigurationValue()
            {
                Id = "Logging:IncludeScopes",
                Value = "false"
            },
            new EformConfigurationValue()
            {
                Id = "Logging:IncludeScopes:LogLevel:Default",
                Value = "Debug"
            },
            new EformConfigurationValue()
            {
                Id = "Logging:IncludeScopes:LogLevel:System",
                Value = "Information"
            },
            new EformConfigurationValue()
            {
                Id = "Logging:IncludeScopes:LogLevel:Microsoft",
                Value = "Information"
            },
            new EformConfigurationValue()
            {
                Id = "EformTokenOptions:Issuer",
                Value = "eForm API"
            },
            new EformConfigurationValue()
            {
                Id = "EformTokenOptions:Audience",
                Value = "eForm Angular"
            },
            new EformConfigurationValue()
            {
                Id = "EformTokenOptions:Expiration",
                Value = "12:00:00"
            },
            new EformConfigurationValue()
            {
                Id = "EformTokenOptions:SigningKey",
                Value = "lTBBR6Wt7RTvcI0jwRvXVPTOmcFV6NnAUA+rIWn/5bs="
            },
            new EformConfigurationValue()
            {
                Id = "EformTokenOptions:CookieName",
                Value = "Authorization"
            },

        };

        public static ModelBuilder AddConfigurationDefault(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EformConfigurationValue>().HasData(Data);
            return modelBuilder;
        }
    }
}
/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using eFormAPI.Web.Hosting;


namespace eFormAPI.Web.Migrations
{
    public partial class AddDefaultSettingsData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            string autoIDGenStrategy = "SqlServer:ValueGenerationStrategy";
            object autoIDGenStrategyValue = SqlServerValueGenerationStrategy.IdentityColumn;
            if (DbConfig.IsMySQL)
            {
                autoIDGenStrategy = "MySql:ValueGenerationStrategy";
                autoIDGenStrategyValue = MySqlValueGenerationStrategy.IdentityColumn;
            }
            migrationBuilder.CreateTable(
                name: "ConfigurationValues",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConfigurationValues", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "ConfigurationValues",
                columns: new[] { "Id", "Value" },
                values: new object[,]
                {
                    { "ConnectionStringsSdk:SdkConnection", "" },
                    { "EformTokenOptions:Expiration", "12:00:00" },
                    { "EformTokenOptions:Audience", "eForm Angular" },
                    { "EformTokenOptions:Issuer", "eForm API" },
                    { "Logging:IncludeScopes:LogLevel:Microsoft", "Information" },
                    { "Logging:IncludeScopes:LogLevel:System", "Information" },
                    { "Logging:IncludeScopes:LogLevel:Default", "Debug" },
                    { "Logging:IncludeScopes", "false" },
                    { "HeaderSettings:ImageLinkVisible", "true" },
                    { "HeaderSettings:ImageLink", "" },
                    { "HeaderSettings:SecondaryTextVisible", "true" },
                    { "HeaderSettings:SecondaryText", "No more paper-forms and back-office data entry" },
                    { "HeaderSettings:MainTextVisible", "true" },
                    { "HeaderSettings:MainText", "eForm Backend" },
                    { "EformTokenOptions:SigningKey", "lTBBR6Wt7RTvcI0jwRvXVPTOmcFV6NnAUA+rIWn/5bs=" },
                    { "LoginPageSettings:ImageLinkVisible", "true" },
                    { "LoginPageSettings:SecondaryTextVisible", "true" },
                    { "LoginPageSettings:SecondaryText", "No more paper-forms and back-office data entry" },
                    { "LoginPageSettings:MainTextVisible", "true" },
                    { "LoginPageSettings:MainText", "eForm Backend" },
                    { "EmailSettings:Password", "" },
                    { "EmailSettings:Login", "" },
                    { "EmailSettings:SmtpPort", "25" },
                    { "EmailSettings:SmtpHost", "" },
                    { "ApplicationSettings:IsTwoFactorForced", "false" },
                    { "ApplicationSettings:DefaultPassword", "Qq1234567$" },
                    { "ApplicationSettings:SecurityCode", "code" },
                    { "ApplicationSettings:SiteLink", "" },
                    { "ApplicationSettings:DefaultLocale", "en-US" },
                    { "LoginPageSettings:ImageLink", "" },
                    { "EformTokenOptions:CookieName", "Authorization" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConfigurationValues_Id",
                table: "ConfigurationValues",
                column: "Id",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ConfigurationValues");
        }
    }
}

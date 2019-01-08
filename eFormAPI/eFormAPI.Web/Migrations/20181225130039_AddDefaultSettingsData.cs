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
                    { "HeaderSettings:MainText", "Microting eForm" },
                    { "EformTokenOptions:SigningKey", "lTBBR6Wt7RTvcI0jwRvXVPTOmcFV6NnAUA+rIWn/5bs=" },
                    { "LoginPageSettings:ImageLinkVisible", "true" },
                    { "LoginPageSettings:SecondaryTextVisible", "true" },
                    { "LoginPageSettings:SecondaryText", "No more paper-forms and back-office data entry" },
                    { "LoginPageSettings:MainTextVisible", "true" },
                    { "LoginPageSettings:MainText", "Microting eForm" },
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

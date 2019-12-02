using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class UpdateConfigurationData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "ConfigurationValues",
                columns: new[] { "Id", "Value" },
                values: new object[] { "PluginStoreSettings:PluginListLink", "https://raw.githubusercontent.com/microting/eform-angular-frontend/stable/plugins.json" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ConfigurationValues",
                keyColumn: "Id",
                keyValue: "PluginStoreSettings:PluginListLink");
        }
    }
}

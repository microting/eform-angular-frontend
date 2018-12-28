using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddPluginsSettingsMenuItem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "MenuItems",
                columns: new[] { "Id", "E2EId", "Link", "LocaleName", "MenuPosition", "Name", "ParentId", "Position" },
                values: new object[] { 16, "plugins-settings", "/plugins-settings", "PluginsSettings", 1, "Plugins Settings", 3, 6 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 16);
        }
    }
}

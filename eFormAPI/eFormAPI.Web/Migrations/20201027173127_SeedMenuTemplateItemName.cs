using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class SeedMenuTemplateItemName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "MenuTemplates",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "MyEforms");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 2,
                column: "Name",
                value: "DeviceUsers");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "Advanced");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 4,
                column: "Name",
                value: "Sites");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 5,
                column: "Name",
                value: "Workers");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 6,
                column: "Name",
                value: "Units");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 7,
                column: "Name",
                value: "SearchableList");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 8,
                column: "Name",
                value: "SelectableList");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 9,
                column: "Name",
                value: "ApplicationSettings");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 10,
                column: "Name",
                value: "PluginsSettings");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 11,
                column: "Name",
                value: "Folders");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 12,
                column: "Name",
                value: "EmailRecipients");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "MenuTemplates");
        }
    }
}

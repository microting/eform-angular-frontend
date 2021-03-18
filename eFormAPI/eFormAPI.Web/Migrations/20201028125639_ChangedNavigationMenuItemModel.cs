using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class ChangedNavigationMenuItemModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "MenuItems",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "My Eforms");

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 2,
                column: "Name",
                value: "Device Users");

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "Advanced");

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 4,
                column: "Name",
                value: "Sites");

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 5,
                column: "Name",
                value: "Workers");

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 6,
                column: "Name",
                value: "Units");

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 7,
                column: "Name",
                value: "Searchable list");

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 8,
                column: "Name",
                value: "Selectable List");

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 9,
                column: "Name",
                value: "Application settings");

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 10,
                column: "Name",
                value: "Plugin Settings");

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 11,
                column: "Name",
                value: "Folders");

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 12,
                column: "Name",
                value: "Email recipients");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 1,
                column: "Name",
                value: "My Eforms");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 2,
                column: "Name",
                value: "Device Users");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 7,
                column: "Name",
                value: "Searchable list");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 8,
                column: "Name",
                value: "Selectable List");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 9,
                column: "Name",
                value: "Application settings");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 10,
                column: "Name",
                value: "Plugins");

            migrationBuilder.UpdateData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 12,
                column: "Name",
                value: "Email recipients");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "MenuItems");

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
                keyValue: 12,
                column: "Name",
                value: "EmailRecipients");
        }
    }
}

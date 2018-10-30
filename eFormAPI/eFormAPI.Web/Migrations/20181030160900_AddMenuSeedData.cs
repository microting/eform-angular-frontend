using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddMenuSeedData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MenuPosition",
                table: "MenuItems",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "MenuItems",
                columns: new[] { "Id", "MenuPosition", "Name", "ParentId", "Position" },
                values: new object[,]
                {
                    { 1, 1, "My eForms", null, 0 },
                    { 2, 1, "Device Users", null, 1 },
                    { 3, 1, "Advanced", null, 2 },
                    { 10, 2, "User Management", null, 0 },
                    { 11, 2, "Settings", null, 1 },
                    { 12, 2, "Security", null, 2 },
                    { 13, 2, "Change password", null, 3 },
                    { 14, 2, "Logout", null, 4 }
                });

            migrationBuilder.InsertData(
                table: "MenuItems",
                columns: new[] { "Id", "MenuPosition", "Name", "ParentId", "Position" },
                values: new object[,]
                {
                    { 4, 1, "Sites", 3, 0 },
                    { 5, 1, "Workers", 3, 1 },
                    { 6, 1, "Units", 3, 2 },
                    { 7, 1, "Searchable list", 3, 3 },
                    { 8, 1, "Selectable list", 3, 4 },
                    { 9, 1, "Application Settings", 3, 5 }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DropColumn(
                name: "MenuPosition",
                table: "MenuItems");
        }
    }
}

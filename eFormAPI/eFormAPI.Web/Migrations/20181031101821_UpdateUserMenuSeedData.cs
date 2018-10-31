using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class UpdateUserMenuSeedData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "E2EId", "Link", "Name" },
                values: new object[] { "sign-out-dropdown", "", "user" });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "E2EId", "Link", "Name", "ParentId", "Position" },
                values: new object[] { "user-management-menu", "/account-management/users", "User Management", 10, 0 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "E2EId", "Link", "Name", "ParentId", "Position" },
                values: new object[] { "settings", "/account-management/settings", "Settings", 10, 1 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "E2EId", "Link", "Name", "ParentId", "Position" },
                values: new object[] { "security", "/security", "Security", 10, 2 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "E2EId", "Link", "Name", "ParentId", "Position" },
                values: new object[] { "change-password", "/account-management/change-password", "Change password", 10, 3 });

            migrationBuilder.InsertData(
                table: "MenuItems",
                columns: new[] { "Id", "E2EId", "Link", "MenuPosition", "Name", "ParentId", "Position" },
                values: new object[] { 15, "sign-out", "/auth/sign-out", 2, "Logout", 10, 4 });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "E2EId", "Link", "Name" },
                values: new object[] { "user-management-menu", "/account-management/users", "User Management" });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "E2EId", "Link", "Name", "ParentId", "Position" },
                values: new object[] { "settings", "/account-management/settings", "Settings", null, 1 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "E2EId", "Link", "Name", "ParentId", "Position" },
                values: new object[] { "security", "/security", "Security", null, 2 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "E2EId", "Link", "Name", "ParentId", "Position" },
                values: new object[] { "change-password", "/account-management/change-password", "Change password", null, 3 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "E2EId", "Link", "Name", "ParentId", "Position" },
                values: new object[] { "sign-out", "/auth/sign-out", "Logout", null, 4 });
        }
    }
}

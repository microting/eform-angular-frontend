using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddSeedData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PermissionState",
                table: "GroupPermissions");

            migrationBuilder.InsertData(
                table: "PermissionTypes",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Workers" },
                    { 2, "Sites" },
                    { 3, "EntitySearch" },
                    { 4, "EntitySelect" },
                    { 5, "UserManagement" },
                    { 6, "Eforms" }
                });

            migrationBuilder.InsertData(
                table: "SecurityGroups",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "eForm admins" },
                    { 2, "eForm users" }
                });

            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "Id", "ClaimName", "PermissionName", "PermissionTypeId" },
                values: new object[,]
                {
                    { 2, "workers_read", "Read", 1 },
                    { 19, "users_update", "Update", 5 },
                    { 20, "users_delete", "Delete", 5 },
                    { 17, "users_create", "Create", 5 },
                    { 18, "users_read", "Read", 5 },
                    { 15, "entity_select_update", "Update", 4 },
                    { 16, "entity_select_delete", "Delete", 4 },
                    { 13, "entity_select_create", "Create", 4 },
                    { 14, "entity_select_read", "Read", 4 },
                    { 11, "entity_search_update", "Update", 3 },
                    { 12, "entity_search_delete", "Delete", 3 },
                    { 9, "entity_search_create", "Create", 3 },
                    { 10, "entity_search_read", "Read", 3 },
                    { 7, "sites_update", "Update", 2 },
                    { 8, "sites_delete", "Delete", 2 },
                    { 5, "sites_create", "Create", 2 },
                    { 6, "sites_read", "Read", 2 },
                    { 3, "workers_update", "Update", 1 },
                    { 4, "workers_delete", "Delete", 1 },
                    { 1, "workers_create", "Create", 1 },
                    { 21, "eforms_create", "Create", 6 },
                    { 22, "eforms_delete", "Delete", 6 }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "SecurityGroups",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "SecurityGroups",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "PermissionTypes",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "PermissionTypes",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "PermissionTypes",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "PermissionTypes",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "PermissionTypes",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "PermissionTypes",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.AddColumn<int>(
                name: "PermissionState",
                table: "GroupPermissions",
                nullable: false,
                defaultValue: 0);
        }
    }
}

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
                    { 3, "Entity search" },
                    { 4, "Entity select" },
                    { 5, "User management" },
                    { 6, "Units" },
                    { 7, "Device users" },
                    { 8, "Eforms" }
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
                    { 23, "device_users_create", "Create", 7 },
                    { 26, "device_users_delete", "Delete", 7 },
                    { 25, "device_users_update", "Update", 7 },
                    { 27, "eforms_create", "Create", 8 },
                    { 28, "eforms_delete", "Delete", 8 },
                    { 29, "eforms_read", "Read", 8 },
                    { 30, "eforms_update_columns", "Update columns", 8 },
                    { 31, "eforms_download_xml", "Download XML", 8 },
                    { 32, "eforms_upload_zip", "Upload ZIP", 8 },
                    { 33, "eforms_case_read", "Case read", 8 },
                    { 34, "eforms_cases_read", "Cases read", 8 },
                    { 35, "eforms_cases_update", "Cases update", 8 },
                    { 36, "eforms_cases_delete", "Cases delete", 8 },
                    { 37, "eforms_get_pdf", "Get PDF", 8 },
                    { 38, "eforms_pairing_read", "Pairing read", 8 },
                    { 39, "eforms_pairing_update", "Pairing update", 8 },
                    { 40, "eforms_read_tags", "Read tags", 8 },
                    { 24, "device_users_read", "Read", 7 },
                    { 41, "eforms_update_tags", "Update tags", 8 },
                    { 22, "units_update", "Update", 6 },
                    { 19, "users_update", "Update", 5 },
                    { 1, "workers_create", "Create", 1 },
                    { 4, "workers_delete", "Delete", 1 },
                    { 3, "workers_update", "Update", 1 },
                    { 6, "sites_read", "Read", 2 },
                    { 8, "sites_delete", "Delete", 2 },
                    { 7, "sites_update", "Update", 2 },
                    { 10, "entity_search_read", "Read", 3 },
                    { 9, "entity_search_create", "Create", 3 },
                    { 12, "entity_search_delete", "Delete", 3 },
                    { 11, "entity_search_update", "Update", 3 },
                    { 14, "entity_select_read", "Read", 4 },
                    { 13, "entity_select_create", "Create", 4 },
                    { 16, "entity_select_delete", "Delete", 4 },
                    { 15, "entity_select_update", "Update", 4 },
                    { 18, "users_read", "Read", 5 },
                    { 17, "users_create", "Create", 5 },
                    { 20, "users_delete", "Delete", 5 },
                    { 21, "units_read", "Read", 6 },
                    { 42, "eforms_get_csv", "Get CSV", 8 }
                });

            migrationBuilder.InsertData(
                table: "GroupPermissions",
                columns: new[] { "Id", "PermissionId", "SecurityGroupId" },
                values: new object[,]
                {
                    { 2, 27, 1 },
                    { 18, 37, 2 },
                    { 12, 37, 1 },
                    { 10, 36, 1 },
                    { 17, 35, 2 },
                    { 9, 35, 1 },
                    { 16, 34, 2 },
                    { 8, 34, 1 },
                    { 15, 33, 2 },
                    { 7, 33, 1 },
                    { 6, 32, 1 },
                    { 5, 31, 1 },
                    { 4, 30, 1 },
                    { 13, 29, 2 },
                    { 1, 29, 1 },
                    { 3, 28, 1 },
                    { 11, 42, 1 },
                    { 14, 42, 2 }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 18);

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
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 38);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 39);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 40);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 41);

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

            migrationBuilder.DeleteData(
                table: "PermissionTypes",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 35);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 36);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 37);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 42);

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
                keyValue: 8);

            migrationBuilder.AddColumn<int>(
                name: "PermissionState",
                table: "GroupPermissions",
                nullable: false,
                defaultValue: 0);
        }
    }
}

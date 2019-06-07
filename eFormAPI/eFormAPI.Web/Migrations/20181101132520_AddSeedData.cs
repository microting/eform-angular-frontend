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
using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddSeedData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "MenuItems",
                columns: new[] { "Id", "E2EId", "Link", "MenuPosition", "Name", "ParentId", "Position" },
                values: new object[,]
                {
                    { 1, "my-eforms", "/", 1, "My eForms", null, 0 },
                    { 2, "device-users", "/simplesites", 1, "Device Users", null, 1 },
                    { 3, "advanced", "", 1, "Advanced", null, 2 },
                    { 10, "sign-out-dropdown", "", 2, "user", null, 0 }
                });

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
                    { 8, "Cases" },
                    { 9, "Eforms" }
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
                table: "MenuItems",
                columns: new[] { "Id", "E2EId", "Link", "MenuPosition", "Name", "ParentId", "Position" },
                values: new object[,]
                {
                    { 4, "sites", "/advanced/sites", 1, "Sites", 3, 0 },
                    { 15, "sign-out", "/auth/sign-out", 2, "Logout", 10, 4 },
                    { 13, "security", "/security", 2, "Security", 10, 2 },
                    { 12, "settings", "/account-management/settings", 2, "Settings", 10, 1 },
                    { 11, "user-management-menu", "/account-management/users", 2, "User Management", 10, 0 },
                    { 14, "change-password", "/account-management/change-password", 2, "Change password", 10, 3 },
                    { 8, "selectable-list", "/advanced/entity-select", 1, "Selectable list", 3, 4 },
                    { 7, "search", "/advanced/entity-search", 1, "Searchable list", 3, 3 },
                    { 6, "units", "/advanced/units", 1, "Units", 3, 2 },
                    { 5, "workers", "/advanced/workers", 1, "Workers", 3, 1 },
                    { 9, "application-settings", "/application-settings", 1, "Application Settings", 3, 5 }
                });

            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "Id", "ClaimName", "PermissionName", "PermissionTypeId" },
                values: new object[,]
                {
                    { 36, "case_delete", "Case delete", 8 },
                    { 23, "device_users_create", "Create", 7 },
                    { 26, "device_users_delete", "Delete", 7 },
                    { 25, "device_users_update", "Update", 7 },
                    { 33, "cases_read", "Cases read", 8 },
                    { 34, "case_read", "Case read", 8 },
                    { 35, "case_update", "Case update", 8 },
                    { 37, "case_get_pdf", "Get PDF", 8 },
                    { 32, "eforms_upload_zip", "Upload ZIP", 9 },
                    { 28, "eforms_delete", "Delete", 9 },
                    { 29, "eforms_read", "Read", 9 },
                    { 30, "eforms_update_columns", "Update columns", 9 },
                    { 31, "eforms_download_xml", "Download XML", 9 },
                    { 24, "device_users_read", "Read", 7 },
                    { 38, "eforms_pairing_read", "Pairing read", 9 },
                    { 39, "eforms_pairing_update", "Pairing update", 9 },
                    { 40, "eforms_read_tags", "Read tags", 9 },
                    { 27, "eforms_create", "Create", 9 },
                    { 22, "units_update", "Update", 6 },
                    { 15, "entity_select_update", "Update", 4 },
                    { 19, "users_update", "Update", 5 },
                    { 2, "workers_read", "Read", 1 },
                    { 1, "workers_create", "Create", 1 },
                    { 4, "workers_delete", "Delete", 1 },
                    { 3, "workers_update", "Update", 1 },
                    { 6, "sites_read", "Read", 2 },
                    { 8, "sites_delete", "Delete", 2 },
                    { 7, "sites_update", "Update", 2 },
                    { 10, "entity_search_read", "Read", 3 },
                    { 21, "units_read", "Read", 6 },
                    { 9, "entity_search_create", "Create", 3 },
                    { 11, "entity_search_update", "Update", 3 },
                    { 14, "entity_select_read", "Read", 4 },
                    { 13, "entity_select_create", "Create", 4 },
                    { 16, "entity_select_delete", "Delete", 4 },
                    { 41, "eforms_update_tags", "Update tags", 9 },
                    { 18, "users_read", "Read", 5 },
                    { 17, "users_create", "Create", 5 },
                    { 20, "users_delete", "Delete", 5 },
                    { 12, "entity_search_delete", "Delete", 3 },
                    { 42, "eforms_get_csv", "Get CSV", 9 }
                });

            migrationBuilder.InsertData(
                table: "GroupPermissions",
                columns: new[] { "Id", "PermissionId", "SecurityGroupId" },
                values: new object[,]
                {
                    { 8, 33, 1 },
                    { 6, 32, 1 },
                    { 5, 31, 1 },
                    { 4, 30, 1 },
                    { 13, 29, 2 },
                    { 1, 29, 1 },
                    { 3, 28, 1 },
                    { 2, 27, 1 },
                    { 18, 37, 2 },
                    { 12, 37, 1 },
                    { 10, 36, 1 },
                    { 17, 35, 2 },
                    { 9, 35, 1 },
                    { 15, 34, 2 },
                    { 7, 34, 1 },
                    { 16, 33, 2 },
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
                keyValue: 15);

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
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 10);

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

            migrationBuilder.DeleteData(
                table: "PermissionTypes",
                keyColumn: "Id",
                keyValue: 9);
        }
    }
}

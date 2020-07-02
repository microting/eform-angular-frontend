using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddedEformExcelPermission : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "Id", "ClaimName", "CreatedAt", "CreatedByUserId", "PermissionName", "PermissionTypeId", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 47, "eform_export_eform_excel", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Export eForm excel", 9, null, 0, 0, null });

            migrationBuilder.InsertData(
                table: "GroupPermissions",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "PermissionId", "SecurityGroupId", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 27, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, 47, 1, null, 0, 0, null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 47);
        }
    }
}

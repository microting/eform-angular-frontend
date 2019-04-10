using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddingNewPermissions : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "Id", "ClaimName", "CreatedAt", "CreatedByUserId", "PermissionName", "PermissionTypeId", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 45, "case_get_docx", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Get DOCX", 8, null, 0, 0, null });

            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "Id", "ClaimName", "CreatedAt", "CreatedByUserId", "PermissionName", "PermissionTypeId", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 46, "case_get_pptx", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Get PPTX", 8, null, 0, 0, null });

            migrationBuilder.InsertData(
                table: "GroupPermissions",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "PermissionId", "SecurityGroupId", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 25, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, 45, 1, null, 0, 0, null });

            migrationBuilder.InsertData(
                table: "GroupPermissions",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "PermissionId", "SecurityGroupId", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 26, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, 46, 1, null, 0, 0, null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 45);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 46);
        }
    }
}

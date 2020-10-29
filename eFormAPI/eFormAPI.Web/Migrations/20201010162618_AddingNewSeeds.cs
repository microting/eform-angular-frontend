using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddingNewSeeds : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "PermissionTypes",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "Name", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 10, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "EmailRecipients", null, 0, 0, null });

            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "Id", "ClaimName", "CreatedAt", "CreatedByUserId", "PermissionName", "PermissionTypeId", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 49, "email_recipient_create", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Create e-mail recipients", 10, null, 0, 0, null });

            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "Id", "ClaimName", "CreatedAt", "CreatedByUserId", "PermissionName", "PermissionTypeId", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 50, "email_recipient_delete", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Delete e-mail recipients", 10, null, 0, 0, null });

            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "Id", "ClaimName", "CreatedAt", "CreatedByUserId", "PermissionName", "PermissionTypeId", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 51, "email_recipient_read", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Read e-mail recipients", 10, null, 0, 0, null });

            migrationBuilder.InsertData(
                table: "GroupPermissions",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "PermissionId", "SecurityGroupId", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 28, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, 49, 2, null, 0, 0, null });

            migrationBuilder.InsertData(
                table: "GroupPermissions",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "PermissionId", "SecurityGroupId", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 29, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, 50, 2, null, 0, 0, null });

            migrationBuilder.InsertData(
                table: "GroupPermissions",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "PermissionId", "SecurityGroupId", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 30, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, 51, 2, null, 0, 0, null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 49);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 50);

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 51);

            migrationBuilder.DeleteData(
                table: "PermissionTypes",
                keyColumn: "Id",
                keyValue: 10);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class UpdateDefaultGroupPermission : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "PermissionId", "SecurityGroupId" },
                values: new object[] { 38, 1 });

            migrationBuilder.UpdateData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "PermissionId", "SecurityGroupId" },
                values: new object[] { 39, 1 });

            migrationBuilder.UpdateData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "PermissionId", "SecurityGroupId" },
                values: new object[] { 41, 1 });

            migrationBuilder.UpdateData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "PermissionId", "SecurityGroupId" },
                values: new object[] { 40, 1 });

            migrationBuilder.UpdateData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 17,
                column: "PermissionId",
                value: 29);

            migrationBuilder.UpdateData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 18,
                column: "PermissionId",
                value: 42);

            migrationBuilder.InsertData(
                table: "GroupPermissions",
                columns: new[] { "Id", "PermissionId", "SecurityGroupId" },
                values: new object[,]
                {
                    { 19, 34, 2 },
                    { 20, 33, 2 },
                    { 21, 35, 2 },
                    { 22, 37, 2 }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.UpdateData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "PermissionId", "SecurityGroupId" },
                values: new object[] { 29, 2 });

            migrationBuilder.UpdateData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "PermissionId", "SecurityGroupId" },
                values: new object[] { 42, 2 });

            migrationBuilder.UpdateData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "PermissionId", "SecurityGroupId" },
                values: new object[] { 34, 2 });

            migrationBuilder.UpdateData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "PermissionId", "SecurityGroupId" },
                values: new object[] { 33, 2 });

            migrationBuilder.UpdateData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 17,
                column: "PermissionId",
                value: 35);

            migrationBuilder.UpdateData(
                table: "GroupPermissions",
                keyColumn: "Id",
                keyValue: 18,
                column: "PermissionId",
                value: 37);
        }
    }
}

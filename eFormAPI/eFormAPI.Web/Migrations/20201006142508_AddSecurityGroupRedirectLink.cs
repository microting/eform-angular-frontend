using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddSecurityGroupRedirectLink : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "UserNameIndex",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "RoleNameIndex",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_PermissionTypes_Name",
                table: "PermissionTypes");

            migrationBuilder.DropIndex(
                name: "IX_Permissions_ClaimName",
                table: "Permissions");

            migrationBuilder.AddColumn<string>(
                name: "RedirectLink",
                table: "SecurityGroups",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "Users",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "Roles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PermissionTypes_Name",
                table: "PermissionTypes",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_ClaimName",
                table: "Permissions",
                column: "ClaimName",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "UserNameIndex",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "RoleNameIndex",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_PermissionTypes_Name",
                table: "PermissionTypes");

            migrationBuilder.DropIndex(
                name: "IX_Permissions_ClaimName",
                table: "Permissions");

            migrationBuilder.DropColumn(
                name: "RedirectLink",
                table: "SecurityGroups");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "Users",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "Roles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_PermissionTypes_Name",
                table: "PermissionTypes",
                column: "Name",
                unique: true,
                filter: "[Name] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_ClaimName",
                table: "Permissions",
                column: "ClaimName",
                unique: true,
                filter: "[ClaimName] IS NOT NULL");
        }
    }
}

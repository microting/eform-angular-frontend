using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddPermissionsTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //Setup for SQL Server Provider

            string autoIDGenStrategy = "SqlServer:ValueGenerationStrategy";
            object autoIDGenStrategyValue = SqlServerValueGenerationStrategy.IdentityColumn;

            // Setup for MySQL Provider
            if (migrationBuilder.ActiveProvider == "Pomelo.EntityFrameworkCore.MySql")
            {
                DbConfig.IsMySQL = true;
                autoIDGenStrategy = "MySQL:ValueGeneratedOnAdd";
                autoIDGenStrategyValue = true;
            }
            migrationBuilder.DropIndex(
                name: "IX_SecurityGroupUsers_EformUserId",
                table: "SecurityGroupUsers");

            migrationBuilder.CreateTable(
                name: "PermissionTypes",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation(autoIDGenStrategy, autoIDGenStrategyValue),
                    Name = table.Column<string>(maxLength: 250, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PermissionTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Permissions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation(autoIDGenStrategy, autoIDGenStrategyValue),
                    PermissionName = table.Column<string>(maxLength: 250, nullable: true),
                    ClaimName = table.Column<string>(maxLength: 250, nullable: true),
                    PermissionTypeId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Permissions_PermissionTypes_PermissionTypeId",
                        column: x => x.PermissionTypeId,
                        principalTable: "PermissionTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GroupPermissions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation(autoIDGenStrategy, autoIDGenStrategyValue),
                    PermissionState = table.Column<int>(nullable: false),
                    PermissionId = table.Column<int>(nullable: false),
                    SecurityGroupId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupPermissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupPermissions_Permissions_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GroupPermissions_SecurityGroups_SecurityGroupId",
                        column: x => x.SecurityGroupId,
                        principalTable: "SecurityGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SecurityGroupUsers_EformUserId_SecurityGroupId",
                table: "SecurityGroupUsers",
                columns: new[] { "EformUserId", "SecurityGroupId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GroupPermissions_SecurityGroupId",
                table: "GroupPermissions",
                column: "SecurityGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_GroupPermissions_PermissionId_SecurityGroupId",
                table: "GroupPermissions",
                columns: new[] { "PermissionId", "SecurityGroupId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_ClaimName",
                table: "Permissions",
                column: "ClaimName",
                unique: true,
                filter: "[ClaimName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Permissions_PermissionTypeId",
                table: "Permissions",
                column: "PermissionTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PermissionTypes_Name",
                table: "PermissionTypes",
                column: "Name",
                unique: true,
                filter: "[Name] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GroupPermissions");

            migrationBuilder.DropTable(
                name: "Permissions");

            migrationBuilder.DropTable(
                name: "PermissionTypes");

            migrationBuilder.DropIndex(
                name: "IX_SecurityGroupUsers_EformUserId_SecurityGroupId",
                table: "SecurityGroupUsers");

            migrationBuilder.CreateIndex(
                name: "IX_SecurityGroupUsers_EformUserId",
                table: "SecurityGroupUsers",
                column: "EformUserId");
        }
    }
}

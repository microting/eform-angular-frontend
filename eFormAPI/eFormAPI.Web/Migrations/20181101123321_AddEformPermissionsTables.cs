using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddEformPermissionsTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //Setup for SQL Server Provider

            var autoIDGenStrategy = "SqlServer:ValueGenerationStrategy";
            object autoIDGenStrategyValue = SqlServerValueGenerationStrategy.IdentityColumn;

            // Setup for MySQL Provider
            if (migrationBuilder.ActiveProvider == "Pomelo.EntityFrameworkCore.MySql")
            {
                DbConfig.IsMySQL = true;
                autoIDGenStrategy = "MySQL:ValueGeneratedOnAdd";
                autoIDGenStrategyValue = true;
            }
            migrationBuilder.DropColumn(
                name: "PermissionState",
                table: "GroupPermissions");

            migrationBuilder.CreateTable(
                name: "EformInGroups",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation(autoIDGenStrategy, autoIDGenStrategyValue),
                    TemplateId = table.Column<int>(nullable: false),
                    SecurityGroupId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EformInGroups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EformInGroups_SecurityGroups_SecurityGroupId",
                        column: x => x.SecurityGroupId,
                        principalTable: "SecurityGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MenuItems",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation(autoIDGenStrategy, autoIDGenStrategyValue),
                    Name = table.Column<string>(maxLength: 250, nullable: true),
                    Link = table.Column<string>(nullable: true),
                    E2EId = table.Column<string>(nullable: true),
                    Position = table.Column<int>(nullable: false),
                    MenuPosition = table.Column<int>(nullable: false),
                    ParentId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenuItems_MenuItems_ParentId",
                        column: x => x.ParentId,
                        principalTable: "MenuItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EformPermissions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation(autoIDGenStrategy, autoIDGenStrategyValue),
                    PermissionId = table.Column<int>(nullable: false),
                    EformInGroupId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EformPermissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EformPermissions_EformInGroups_EformInGroupId",
                        column: x => x.EformInGroupId,
                        principalTable: "EformInGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EformPermissions_Permissions_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EformInGroups_SecurityGroupId",
                table: "EformInGroups",
                column: "SecurityGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_EformInGroups_TemplateId",
                table: "EformInGroups",
                column: "TemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_EformInGroups_TemplateId_SecurityGroupId",
                table: "EformInGroups",
                columns: new[] { "TemplateId", "SecurityGroupId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EformPermissions_EformInGroupId",
                table: "EformPermissions",
                column: "EformInGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_EformPermissions_PermissionId_EformInGroupId",
                table: "EformPermissions",
                columns: new[] { "PermissionId", "EformInGroupId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MenuItems_ParentId",
                table: "MenuItems",
                column: "ParentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EformPermissions");

            migrationBuilder.DropTable(
                name: "MenuItems");

            migrationBuilder.DropTable(
                name: "EformInGroups");

            migrationBuilder.AddColumn<int>(
                name: "PermissionState",
                table: "GroupPermissions",
                nullable: false,
                defaultValue: 0);
        }
    }
}

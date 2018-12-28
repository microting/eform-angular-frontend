using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddPluginsTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EformPlugins",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    PluginId = table.Column<string>(maxLength: 25, nullable: false),
                    ConnectionString = table.Column<string>(nullable: true, defaultValue: "..."),
                    Status = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EformPlugins", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EformPlugins_PluginId",
                table: "EformPlugins",
                column: "PluginId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EformPlugins");
        }
    }
}

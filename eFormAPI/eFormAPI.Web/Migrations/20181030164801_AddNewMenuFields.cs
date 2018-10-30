using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddNewMenuFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "E2EId",
                table: "MenuItems",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Link",
                table: "MenuItems",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "E2EId",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "Link",
                table: "MenuItems");
        }
    }
}

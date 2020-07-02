using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    using Hosting;

    public partial class AddingNewAttributesToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Setup for MySQL Provider
            if (migrationBuilder.ActiveProvider == "Pomelo.EntityFrameworkCore.MySql")
            {
                DbConfig.IsMySQL = true;
            }

            migrationBuilder.AddColumn<bool>(
                name: "DarkTheme",
                table: "Users",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Formats",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TimeZone",
                table: "Users",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DarkTheme",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Formats",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "TimeZone",
                table: "Users");
        }
    }
}

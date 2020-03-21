using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    using Hosting;

    public partial class AddSendGridKeyToConfiguration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Setup for MySQL Provider
            if (migrationBuilder.ActiveProvider == "Pomelo.EntityFrameworkCore.MySql")
            {
                DbConfig.IsMySQL = true;
            }
            migrationBuilder.InsertData(
                table: "ConfigurationValues",
                columns: new[] { "Id", "Value" },
                values: new object[] { "EmailSettings:SendGridKey", "" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ConfigurationValues",
                keyColumn: "Id",
                keyValue: "EmailSettings:SendGridKey");
        }
    }
}

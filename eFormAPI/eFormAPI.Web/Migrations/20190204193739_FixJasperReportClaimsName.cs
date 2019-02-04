using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class FixJasperReportClaimsName : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 43,
                column: "ClaimName",
                value: "eforms_read_jasper_report");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 44,
                column: "ClaimName",
                value: "eforms_update_jasper_report");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 43,
                column: "ClaimName",
                value: "read_jasper_report");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: 44,
                column: "ClaimName",
                value: "update_jasper_report");
        }
    }
}

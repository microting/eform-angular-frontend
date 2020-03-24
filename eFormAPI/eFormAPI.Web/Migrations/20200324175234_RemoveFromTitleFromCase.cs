using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    using Hosting;

    public partial class RemoveFromTitleFromCase : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Setup for MySQL Provider
            if (migrationBuilder.ActiveProvider == "Pomelo.EntityFrameworkCore.MySql")
            {
                DbConfig.IsMySQL = true;
            }

            migrationBuilder.DropForeignKey(
                name: "FK_CasePosts_EmailRecipients_FromId",
                table: "CasePosts");

            migrationBuilder.DropIndex(
                name: "IX_CasePosts_FromId",
                table: "CasePosts");

            migrationBuilder.DropColumn(
                name: "FromId",
                table: "CasePosts");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "CasePosts");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FromId",
                table: "CasePosts",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "CasePosts",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CasePosts_FromId",
                table: "CasePosts",
                column: "FromId");

            migrationBuilder.AddForeignKey(
                name: "FK_CasePosts_EmailRecipients_FromId",
                table: "CasePosts",
                column: "FromId",
                principalTable: "EmailRecipients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

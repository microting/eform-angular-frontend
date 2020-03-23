using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    using Hosting;

    public partial class AddTitleToCasePosts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Setup for MySQL Provider
            if (migrationBuilder.ActiveProvider == "Pomelo.EntityFrameworkCore.MySql")
            {
                DbConfig.IsMySQL = true;
            }

            migrationBuilder.DropIndex(
                name: "IX_CasePosts_TemplateId",
                table: "CasePosts");

            migrationBuilder.DropColumn(
                name: "TemplateId",
                table: "CasePosts");

            migrationBuilder.AddColumn<int>(
                name: "FromId",
                table: "CasePosts");



            migrationBuilder.CreateIndex(
                name: "IX_CasePosts_FromId",
                table: "CasePosts",
                column: "FromId");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "CasePosts",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 16,
                column: "Position",
                value: 8);

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 18,
                column: "Position",
                value: 7);

            migrationBuilder.AddForeignKey(
                name: "FK_CasePosts_EmailRecipients_FromId",
                table: "CasePosts",
                column: "FromId",
                principalTable: "EmailRecipients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CasePosts_EmailRecipients_FromId",
                table: "CasePosts");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "CasePosts");

            migrationBuilder.RenameColumn(
                name: "FromId",
                table: "CasePosts",
                newName: "TemplateId");

            migrationBuilder.RenameIndex(
                name: "IX_CasePosts_FromId",
                table: "CasePosts",
                newName: "IX_CasePosts_TemplateId");

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 16,
                column: "Position",
                value: 7);

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 18,
                column: "Position",
                value: 8);
        }
    }
}

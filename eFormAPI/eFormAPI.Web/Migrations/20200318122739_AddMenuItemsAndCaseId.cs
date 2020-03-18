using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    using Hosting;

    public partial class AddMenuItemsAndCaseId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Setup for MySQL Provider
            if (migrationBuilder.ActiveProvider == "Pomelo.EntityFrameworkCore.MySql")
            {
                DbConfig.IsMySQL = true;
            }
            migrationBuilder.AddColumn<int>(
                name: "CaseId",
                table: "CasePosts",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TemplateId",
                table: "CasePosts",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "MenuItems",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "E2EId", "Link", "LocaleName", "MenuPosition", "Name", "ParentId", "Position", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 18, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "email-recipients", "/email-recipients", "EmailRecipients", 1, "Email Recipients", 3, 8, null, 0, 0, null });

            migrationBuilder.CreateIndex(
                name: "IX_CasePosts_CaseId",
                table: "CasePosts",
                column: "CaseId");

            migrationBuilder.CreateIndex(
                name: "IX_CasePosts_TemplateId",
                table: "CasePosts",
                column: "TemplateId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CasePosts_CaseId",
                table: "CasePosts");

            migrationBuilder.DropIndex(
                name: "IX_CasePosts_TemplateId",
                table: "CasePosts");

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DropColumn(
                name: "CaseId",
                table: "CasePosts");

            migrationBuilder.DropColumn(
                name: "TemplateId",
                table: "CasePosts");
        }
    }
}

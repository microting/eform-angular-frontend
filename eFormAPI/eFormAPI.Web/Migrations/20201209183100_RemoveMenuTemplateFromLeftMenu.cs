using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class RemoveMenuTemplateFromLeftMenu : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 13);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "MenuTemplates",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "DefaultLink", "E2EId", "EformPluginId", "Name", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 13, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "/advanced/navigation-menu", "menu-editor", null, "Menu Editor", null, 0, 0, null });
        }
    }
}

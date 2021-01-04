using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class MoveMenuEditorToRightMenu : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 39);

            migrationBuilder.DeleteData(
                table: "MenuTemplateTranslations",
                keyColumn: "Id",
                keyValue: 37);

            migrationBuilder.DeleteData(
                table: "MenuTemplateTranslations",
                keyColumn: "Id",
                keyValue: 38);

            migrationBuilder.DeleteData(
                table: "MenuTemplateTranslations",
                keyColumn: "Id",
                keyValue: 39);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 13);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "MenuItems",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "E2EId", "Link", "MenuTemplateId", "Name", "ParentId", "Position", "Type", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 13, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "menu-editor", "/advanced/navigation-menu", 13, "Menu Editor", 3, 9, 1, null, 0, 0, null });

            migrationBuilder.InsertData(
                table: "MenuTemplateTranslations",
                columns: new[] { "Id", "CreatedAt", "Language", "LocaleName", "MenuTemplateId", "Name", "UpdatedAt", "Version", "WorkflowState" },
                values: new object[,]
                {
                    { 37, null, "English", "en-US", 13, "Menu Editor", null, null, null },
                    { 38, null, "Danish", "da", 13, "Menu Editor", null, null, null },
                    { 39, null, "German", "de-DE", 13, "Menü-Editor", null, null, null }
                });

            migrationBuilder.InsertData(
                table: "MenuItemTranslations",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "Language", "LocaleName", "MenuItemId", "Name", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 13, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "English", "en-US", 13, "Menu Editor", null, 0, 0, null });

            migrationBuilder.InsertData(
                table: "MenuItemTranslations",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "Language", "LocaleName", "MenuItemId", "Name", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 26, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Danish", "da", 13, "Menu Editor", null, 0, 0, null });

            migrationBuilder.InsertData(
                table: "MenuItemTranslations",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "Language", "LocaleName", "MenuItemId", "Name", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 39, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 13, "Menü-Editor", null, 0, 0, null });
        }
    }
}

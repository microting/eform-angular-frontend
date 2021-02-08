using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddedMenuEditorItemToDefaultMenu : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 1, "Mine eForms" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 2, "Mobilbrugere" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 3, "Admin" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 4, "Lokationer" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 5, "Medarbejder" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 6, "Enheder" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 7, "Søgbar Lister" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 8, "Valgbar Liste" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 9, "Applikationsindstillinger" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 10, "Plugins" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 11, "Folders" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 25,
                columns: new[] { "Language", "LocaleName", "MenuItemId", "Name" },
                values: new object[] { "Danish", "da", 12, "E-mail-modtagere" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 27,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 1, "Meine eForms" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 28,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 2, "Gerätebenutzer " });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 29,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 3, "Fortgeschritten" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 30,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 4, "Standorte" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 31,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 5, "Mitarbeiter" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 32,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 6, "Einheiten" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 33,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 7, "Durchsuchbare Listen" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 34,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 8, "Auswählbare Liste" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 35,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 9, "Anwendungseinstellungen" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 36,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 10, "Plugins" });

            migrationBuilder.InsertData(
                table: "MenuItemTranslations",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "Language", "LocaleName", "MenuItemId", "Name", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[,]
                {
                    { 37, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 11, "Folders", null, 0, 0, null },
                    { 38, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 12, "E-Mail-Empfänger", null, 0, 0, null }
                });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "Dropdown");

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 10,
                column: "Link",
                value: "/plugins-settings");

            migrationBuilder.InsertData(
                table: "MenuTemplates",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "DefaultLink", "E2EId", "EformPluginId", "Name", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 13, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "/advanced/navigation-menu", "menu-editor", null, "Menu Editor", null, 0, 0, null });

            migrationBuilder.InsertData(
                table: "MenuItems",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "Link", "MenuTemplateId", "Name", "ParentId", "Position", "Type", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 13, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "/advanced/navigation-menu", 13, "Menu Editor", 3, 9, 1, null, 0, 0, null });

            migrationBuilder.InsertData(
                table: "MenuTemplateTranslations",
                columns: new[] { "Id", "CreatedAt", "Language", "LocaleName", "MenuTemplateId", "Name", "UpdatedAt", "Version", "WorkflowState" },
                values: new object[,]
                {
                    { 37, null, "English", "en-US", 13, "Menu Editor", null, null, null },
                    { 38, null, "Danish", "da", 13, "Menu Editor", null, null, null },
                    { 39, null, "German", "de-DE", 13, "Menü-Editor", null, null, null }
                });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "Language", "LocaleName", "MenuItemId", "Name" },
                values: new object[] { "English", "en-US", 13, "Menu Editor" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 26,
                columns: new[] { "Language", "LocaleName", "MenuItemId", "Name" },
                values: new object[] { "Danish", "da", 13, "Menu Editor" });

            migrationBuilder.InsertData(
                table: "MenuItemTranslations",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "Language", "LocaleName", "MenuItemId", "Name", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[] { 39, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 13, "Menü-Editor", null, 0, 0, null });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
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
                keyValue: 37);

            migrationBuilder.DeleteData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 38);

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

            migrationBuilder.DeleteData(
                table: "MenuTemplates",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 2, "Mobilbrugere" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 3, "Admin" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 4, "Lokationer" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 5, "Medarbejder" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 6, "Enheder" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 7, "Søgbar Lister" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 8, "Valgbar Liste" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 9, "Applikationsindstillinger" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 10, "Plugins" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 11, "Folders" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 12, "E-mail-modtagere" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 25,
                columns: new[] { "Language", "LocaleName", "MenuItemId", "Name" },
                values: new object[] { "German", "de-DE", 1, "Meine eForms" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 27,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 3, "Fortgeschritten" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 28,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 4, "Standorte" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 29,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 5, "Mitarbeiter" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 30,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 6, "Einheiten" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 31,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 7, "Durchsuchbare Listen" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 32,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 8, "Auswählbare Liste" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 33,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 9, "Anwendungseinstellungen" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 34,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 10, "Plugins" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 35,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 11, "Folders" });

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 36,
                columns: new[] { "MenuItemId", "Name" },
                values: new object[] { 12, "E-Mail-Empfänger" });

            migrationBuilder.InsertData(
                table: "MenuItemTranslations",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "Language", "LocaleName", "MenuItemId", "Name", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[,]
                {
                    { 26, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 2, "Gerätebenutzer ", null, 0, 0, null },
                    { 13, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Danish", "da", 1, "Mine eForms", null, 0, 0, null }
                });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 3,
                column: "Name",
                value: "Advanced");

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 10,
                column: "Link",
                value: "/advanced/plugins-settings");
        }
    }
}

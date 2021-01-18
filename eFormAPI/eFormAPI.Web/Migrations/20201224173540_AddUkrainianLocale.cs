using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddUkrainianLocale : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 28,
                column: "Name",
                value: "Gerätebenutzer");

            migrationBuilder.InsertData(
                table: "MenuItemTranslations",
                columns: new[] { "CreatedAt", "CreatedByUserId", "Language", "LocaleName", "MenuItemId", "Name", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[,]
                {
                    { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Ukrainian", "uk-UA", 1, "Мої ЕФорми", null, 0, 0, null },
                    { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Ukrainian", "uk-UA", 2, "Користувачі пристроїв", null, 0, 0, null },
                    { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Ukrainian", "uk-UA", 3, "Додатково", null, 0, 0, null },
                    { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Ukrainian", "uk-UA", 4, "Місця", null, 0, 0, null },
                    { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Ukrainian", "uk-UA", 5, "Працівники", null, 0, 0, null },
                    { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Ukrainian", "uk-UA", 6, "Юніти", null, 0, 0, null },
                    { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Ukrainian", "uk-UA", 7, "Пошуковий список", null, 0, 0, null },
                    { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Ukrainian", "uk-UA", 8, "Вибірковий список", null, 0, 0, null },
                    { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Ukrainian", "uk-UA", 9, "Налаштування застосунку", null, 0, 0, null },
                    { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Ukrainian", "uk-UA", 10, "Налаштування плагінів", null, 0, 0, null },
                    { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Ukrainian", "uk-UA", 11, "Папки", null, 0, 0, null },
                    { new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Ukrainian", "uk-UA", 12, "Email одержувачі", null, 0, 0, null }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 39);

            migrationBuilder.DeleteData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 40);

            migrationBuilder.DeleteData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 41);

            migrationBuilder.DeleteData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 42);

            migrationBuilder.DeleteData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 43);

            migrationBuilder.DeleteData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 44);

            migrationBuilder.DeleteData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 45);

            migrationBuilder.DeleteData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 46);

            migrationBuilder.DeleteData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 47);

            migrationBuilder.DeleteData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 48);

            migrationBuilder.DeleteData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 49);

            migrationBuilder.DeleteData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 50);

            migrationBuilder.UpdateData(
                table: "MenuItemTranslations",
                keyColumn: "Id",
                keyValue: 28,
                column: "Name",
                value: "Gerätebenutzer ");
        }
    }
}

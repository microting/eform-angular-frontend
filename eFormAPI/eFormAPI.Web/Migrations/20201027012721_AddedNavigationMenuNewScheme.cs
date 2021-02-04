using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddedNavigationMenuNewScheme : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuItems_MenuItems_ParentId",
                table: "MenuItems");

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DropColumn(
                name: "E2EId",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "LocaleName",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "MenuPosition",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "MenuItems");

            migrationBuilder.AddColumn<int>(
                name: "MenuTemplateId",
                table: "MenuItems",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "MenuItems",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "MenuItemSecurityGroups",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Version = table.Column<int>(nullable: true),
                    WorkflowState = table.Column<string>(maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: true),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    MenuItemId = table.Column<int>(nullable: false),
                    SecurityGroupId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuItemSecurityGroups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenuItemSecurityGroups_MenuItems_MenuItemId",
                        column: x => x.MenuItemId,
                        principalTable: "MenuItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MenuItemSecurityGroups_SecurityGroups_SecurityGroupId",
                        column: x => x.SecurityGroupId,
                        principalTable: "SecurityGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MenuItemTranslations",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    WorkflowState = table.Column<string>(maxLength: 255, nullable: true),
                    CreatedByUserId = table.Column<int>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: false),
                    Version = table.Column<int>(nullable: false),
                    Name = table.Column<string>(maxLength: 250, nullable: true),
                    LocaleName = table.Column<string>(maxLength: 7, nullable: true),
                    Language = table.Column<string>(nullable: true),
                    MenuItemId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuItemTranslations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenuItemTranslations_MenuItems_MenuItemId",
                        column: x => x.MenuItemId,
                        principalTable: "MenuItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MenuTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    WorkflowState = table.Column<string>(maxLength: 255, nullable: true),
                    CreatedByUserId = table.Column<int>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: false),
                    Version = table.Column<int>(nullable: false),
                    DefaultLink = table.Column<string>(nullable: true),
                    E2EId = table.Column<string>(nullable: true),
                    EformPluginId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuTemplates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenuTemplates_EformPlugins_EformPluginId",
                        column: x => x.EformPluginId,
                        principalTable: "EformPlugins",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MenuTemplatePermissions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Version = table.Column<int>(nullable: true),
                    WorkflowState = table.Column<string>(maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: true),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    MenuTemplateId = table.Column<int>(nullable: false),
                    PermissionId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuTemplatePermissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenuTemplatePermissions_MenuTemplates_MenuTemplateId",
                        column: x => x.MenuTemplateId,
                        principalTable: "MenuTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MenuTemplatePermissions_Permissions_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MenuTemplateTranslations",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Version = table.Column<int>(nullable: true),
                    WorkflowState = table.Column<string>(maxLength: 255, nullable: true),
                    CreatedAt = table.Column<DateTime>(nullable: true),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    Name = table.Column<string>(maxLength: 250, nullable: true),
                    LocaleName = table.Column<string>(maxLength: 7, nullable: true),
                    Language = table.Column<string>(nullable: true),
                    MenuTemplateId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuTemplateTranslations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MenuTemplateTranslations_MenuTemplates_MenuTemplateId",
                        column: x => x.MenuTemplateId,
                        principalTable: "MenuTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "MenuItemTranslations",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "Language", "LocaleName", "MenuItemId", "Name", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[,]
                {
                    { 1, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "English", "en-US", 1, "My eForms", null, 0, 0, null },
                    { 21, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Danish", "da", 9, "Applikationsindstillinger", null, 0, 0, null },
                    { 22, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Danish", "da", 10, "Plugins", null, 0, 0, null },
                    { 23, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Danish", "da", 11, "Folders", null, 0, 0, null },
                    { 25, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 1, "Meine eForms", null, 0, 0, null },
                    { 26, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 2, "Gerätebenutzer ", null, 0, 0, null },
                    { 27, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 3, "Fortgeschritten", null, 0, 0, null },
                    { 28, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 4, "Standorte", null, 0, 0, null },
                    { 29, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 5, "Mitarbeiter", null, 0, 0, null },
                    { 30, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 6, "Einheiten", null, 0, 0, null },
                    { 31, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 7, "Durchsuchbare Listen", null, 0, 0, null },
                    { 32, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 8, "Auswählbare Liste", null, 0, 0, null },
                    { 33, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 9, "Anwendungseinstellungen", null, 0, 0, null },
                    { 34, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 10, "Plugins", null, 0, 0, null },
                    { 35, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 11, "Folders", null, 0, 0, null },
                    { 36, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "German", "de-DE", 12, "E-Mail-Empfänger", null, 0, 0, null },
                    { 20, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Danish", "da", 8, "Valgbar Liste", null, 0, 0, null },
                    { 19, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Danish", "da", 7, "Søgbar Lister", null, 0, 0, null },
                    { 24, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Danish", "da", 12, "E-mail-modtagere", null, 0, 0, null },
                    { 17, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Danish", "da", 5, "Medarbejder", null, 0, 0, null },
                    { 2, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "English", "en-US", 2, "Device Users", null, 0, 0, null },
                    { 3, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "English", "en-US", 3, "Advanced", null, 0, 0, null },
                    { 18, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Danish", "da", 6, "Enheder", null, 0, 0, null },
                    { 5, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "English", "en-US", 5, "Workers", null, 0, 0, null },
                    { 6, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "English", "en-US", 6, "Units", null, 0, 0, null },
                    { 7, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "English", "en-US", 7, "Searchable List", null, 0, 0, null },
                    { 8, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "English", "en-US", 8, "Selectable list", null, 0, 0, null },
                    { 9, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "English", "en-US", 9, "Application Settings", null, 0, 0, null },
                    { 4, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "English", "en-US", 4, "Sites", null, 0, 0, null },
                    { 11, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "English", "en-US", 11, "Folders", null, 0, 0, null },
                    { 12, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "English", "en-US", 12, "Email Recipients", null, 0, 0, null },
                    { 13, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Danish", "da", 1, "Mine eForms", null, 0, 0, null },
                    { 14, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Danish", "da", 2, "Mobilbrugere", null, 0, 0, null },
                    { 15, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Danish", "da", 3, "Admin", null, 0, 0, null },
                    { 16, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "Danish", "da", 4, "Lokationer", null, 0, 0, null },
                    { 10, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "English", "en-US", 10, "Plugins Settings", null, 0, 0, null }
                });

            migrationBuilder.InsertData(
                table: "MenuTemplates",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "DefaultLink", "E2EId", "EformPluginId", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[,]
                {
                    { 10, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "/plugins-settings", "plugins-settings", null, null, 0, 0, null },
                    { 9, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "/application-settings", "application-settings", null, null, 0, 0, null },
                    { 8, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "/advanced/entity-select", "selectable-list", null, null, 0, 0, null },
                    { 7, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "/advanced/entity-search", "search", null, null, 0, 0, null },
                    { 6, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "/advanced/units", "units", null, null, 0, 0, null },
                    { 3, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "", "advanced", null, null, 0, 0, null },
                    { 4, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "/advanced/sites", "sites", null, null, 0, 0, null },
                    { 2, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "/device-users", "device-users", null, null, 0, 0, null },
                    { 1, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "/", "my-eforms", null, null, 0, 0, null },
                    { 11, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "/advanced/folders", "folders", null, null, 0, 0, null },
                    { 5, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "/advanced/workers", "workers", null, null, 0, 0, null },
                    { 12, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "/email-recipients", "email-recipients", null, null, 0, 0, null }
                });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "MenuTemplateId", "Type" },
                values: new object[] { 1, 1 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "MenuTemplateId", "Type" },
                values: new object[] { 2, 1 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "MenuTemplateId", "Type" },
                values: new object[] { 3, 3 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "MenuTemplateId", "Type" },
                values: new object[] { 4, 1 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "MenuTemplateId", "Type" },
                values: new object[] { 5, 1 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "MenuTemplateId", "Type" },
                values: new object[] { 6, 1 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "MenuTemplateId", "Type" },
                values: new object[] { 7, 1 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "MenuTemplateId", "Type" },
                values: new object[] { 8, 1 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "Link", "MenuTemplateId", "Type" },
                values: new object[] { "/advanced/application-settings", 9, 1 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "Link", "MenuTemplateId", "ParentId", "Position", "Type" },
                values: new object[] { "/advanced/plugins-settings", 10, 3, 8, 1 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "Link", "MenuTemplateId", "ParentId", "Position", "Type" },
                values: new object[] { "/advanced/folders", 11, 3, 5, 1 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "Link", "MenuTemplateId", "ParentId", "Position", "Type" },
                values: new object[] { "/email-recipients", 12, 3, 7, 1 });

            migrationBuilder.InsertData(
                table: "MenuTemplatePermissions",
                columns: new[] { "Id", "CreatedAt", "MenuTemplateId", "PermissionId", "UpdatedAt", "Version", "WorkflowState" },
                values: new object[,]
                {
                    { 9, null, 7, 9, null, null, null },
                    { 6, null, 4, 8, null, null, null },
                    { 14, null, 7, 16, null, null, null },
                    { 7, null, 4, 7, null, null, null },
                    { 13, null, 7, 13, null, null, null },
                    { 1, null, 5, 2, null, null, null },
                    { 2, null, 5, 1, null, null, null },
                    { 10, null, 7, 12, null, null, null },
                    { 3, null, 5, 4, null, null, null },
                    { 12, null, 7, 14, null, null, null },
                    { 11, null, 7, 11, null, null, null },
                    { 16, null, 6, 21, null, null, null },
                    { 17, null, 6, 22, null, null, null },
                    { 5, null, 4, 6, null, null, null },
                    { 8, null, 7, 10, null, null, null },
                    { 4, null, 5, 3, null, null, null },
                    { 15, null, 7, 15, null, null, null },
                    { 22, null, 1, 27, null, null, null },
                    { 30, null, 1, 40, null, null, null },
                    { 28, null, 1, 38, null, null, null },
                    { 29, null, 1, 39, null, null, null },
                    { 31, null, 1, 41, null, null, null },
                    { 32, null, 1, 42, null, null, null },
                    { 33, null, 1, 43, null, null, null },
                    { 34, null, 1, 44, null, null, null },
                    { 35, null, 1, 47, null, null, null },
                    { 26, null, 1, 31, null, null, null },
                    { 18, null, 2, 24, null, null, null },
                    { 25, null, 1, 30, null, null, null },
                    { 27, null, 1, 32, null, null, null },
                    { 20, null, 2, 26, null, null, null },
                    { 23, null, 1, 28, null, null, null },
                    { 21, null, 2, 25, null, null, null },
                    { 19, null, 2, 23, null, null, null },
                    { 24, null, 1, 29, null, null, null }
                });

            migrationBuilder.InsertData(
                table: "MenuTemplateTranslations",
                columns: new[] { "Id", "CreatedAt", "Language", "LocaleName", "MenuTemplateId", "Name", "UpdatedAt", "Version", "WorkflowState" },
                values: new object[,]
                {
                    { 24, null, "Danish", "da", 12, "E-mail-modtagere", null, null, null },
                    { 12, null, "English", "en-US", 12, "Email Recipients", null, null, null },
                    { 20, null, "Danish", "da", 8, "Valgbar Liste", null, null, null },
                    { 35, null, "German", "de-DE", 11, "Folders", null, null, null },
                    { 23, null, "Danish", "da", 11, "Folders", null, null, null },
                    { 32, null, "German", "de-DE", 8, "Auswählbare Liste", null, null, null },
                    { 9, null, "English", "en-US", 9, "Application Settings", null, null, null },
                    { 21, null, "Danish", "da", 9, "Applikationsindstillinger", null, null, null },
                    { 33, null, "German", "de-DE", 9, "Anwendungseinstellungen", null, null, null },
                    { 8, null, "English", "en-US", 8, "Selectable list", null, null, null },
                    { 10, null, "English", "en-US", 10, "Plugins Settings", null, null, null },
                    { 22, null, "Danish", "da", 10, "Plugins", null, null, null },
                    { 11, null, "English", "en-US", 11, "Folders", null, null, null },
                    { 34, null, "German", "de-DE", 10, "Plugins", null, null, null },
                    { 15, null, "Danish", "da", 3, "Admin", null, null, null },
                    { 19, null, "Danish", "da", 7, "Søgbar Lister", null, null, null },
                    { 3, null, "English", "en-US", 3, "Advanced", null, null, null },
                    { 26, null, "German", "de-DE", 2, "Gerätebenutzer ", null, null, null },
                    { 4, null, "English", "en-US", 4, "Sites", null, null, null },
                    { 16, null, "Danish", "da", 4, "Lokationer", null, null, null },
                    { 28, null, "German", "de-DE", 4, "Standorte", null, null, null },
                    { 14, null, "Danish", "da", 2, "Mobilbrugere", null, null, null },
                    { 2, null, "English", "en-US", 2, "Device Users", null, null, null },
                    { 36, null, "German", "de-DE", 12, "E-Mail-Empfänger", null, null, null },
                    { 31, null, "German", "de-DE", 7, "Durchsuchbare Listen", null, null, null },
                    { 17, null, "Danish", "da", 5, "Medarbejder", null, null, null },
                    { 25, null, "German", "de-DE", 1, "Meine eForms", null, null, null },
                    { 13, null, "Danish", "da", 1, "Mine eForms", null, null, null },
                    { 6, null, "English", "en-US", 6, "Units", null, null, null },
                    { 18, null, "Danish", "da", 6, "Enheder", null, null, null },
                    { 30, null, "German", "de-DE", 6, "Einheiten", null, null, null },
                    { 1, null, "English", "en-US", 1, "My eForms", null, null, null },
                    { 27, null, "German", "de-DE", 3, "Fortgeschritten", null, null, null },
                    { 7, null, "English", "en-US", 7, "Searchable List", null, null, null },
                    { 29, null, "German", "de-DE", 5, "Mitarbeiter", null, null, null },
                    { 5, null, "English", "en-US", 5, "Workers", null, null, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_MenuItems_MenuTemplateId",
                table: "MenuItems",
                column: "MenuTemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItemSecurityGroups_SecurityGroupId",
                table: "MenuItemSecurityGroups",
                column: "SecurityGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItemSecurityGroups_MenuItemId_SecurityGroupId",
                table: "MenuItemSecurityGroups",
                columns: new[] { "MenuItemId", "SecurityGroupId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MenuItemTranslations_LocaleName",
                table: "MenuItemTranslations",
                column: "LocaleName");

            migrationBuilder.CreateIndex(
                name: "IX_MenuItemTranslations_MenuItemId",
                table: "MenuItemTranslations",
                column: "MenuItemId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuTemplatePermissions_PermissionId",
                table: "MenuTemplatePermissions",
                column: "PermissionId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuTemplatePermissions_MenuTemplateId_PermissionId",
                table: "MenuTemplatePermissions",
                columns: new[] { "MenuTemplateId", "PermissionId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MenuTemplates_EformPluginId",
                table: "MenuTemplates",
                column: "EformPluginId");

            migrationBuilder.CreateIndex(
                name: "IX_MenuTemplateTranslations_LocaleName",
                table: "MenuTemplateTranslations",
                column: "LocaleName");

            migrationBuilder.CreateIndex(
                name: "IX_MenuTemplateTranslations_MenuTemplateId",
                table: "MenuTemplateTranslations",
                column: "MenuTemplateId");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItems_MenuTemplates_MenuTemplateId",
                table: "MenuItems",
                column: "MenuTemplateId",
                principalTable: "MenuTemplates",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItems_MenuItems_ParentId",
                table: "MenuItems",
                column: "ParentId",
                principalTable: "MenuItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuItems_MenuTemplates_MenuTemplateId",
                table: "MenuItems");

            migrationBuilder.DropForeignKey(
                name: "FK_MenuItems_MenuItems_ParentId",
                table: "MenuItems");

            migrationBuilder.DropTable(
                name: "MenuItemSecurityGroups");

            migrationBuilder.DropTable(
                name: "MenuItemTranslations");

            migrationBuilder.DropTable(
                name: "MenuTemplatePermissions");

            migrationBuilder.DropTable(
                name: "MenuTemplateTranslations");

            migrationBuilder.DropTable(
                name: "MenuTemplates");

            migrationBuilder.DropIndex(
                name: "IX_MenuItems_MenuTemplateId",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "MenuTemplateId",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "MenuItems");

            migrationBuilder.AddColumn<string>(
                name: "E2EId",
                table: "MenuItems",
                type: "longtext CHARACTER SET utf8mb4",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LocaleName",
                table: "MenuItems",
                type: "varchar(250) CHARACTER SET utf8mb4",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MenuPosition",
                table: "MenuItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "MenuItems",
                type: "varchar(250) CHARACTER SET utf8mb4",
                maxLength: 250,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "E2EId", "LocaleName", "MenuPosition", "Name" },
                values: new object[] { "my-eforms", "MyEforms", 1, "My eForms" });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "E2EId", "LocaleName", "MenuPosition", "Name" },
                values: new object[] { "device-users", "DeviceUsers", 1, "Device Users" });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "E2EId", "LocaleName", "MenuPosition", "Name" },
                values: new object[] { "advanced", "Advanced", 1, "Advanced" });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "E2EId", "LocaleName", "MenuPosition", "Name" },
                values: new object[] { "sites", "Sites", 1, "Sites" });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "E2EId", "LocaleName", "MenuPosition", "Name" },
                values: new object[] { "workers", "Workers", 1, "Workers" });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "E2EId", "LocaleName", "MenuPosition", "Name" },
                values: new object[] { "units", "Units", 1, "Units" });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "E2EId", "LocaleName", "MenuPosition", "Name" },
                values: new object[] { "search", "SearchableList", 1, "SearchableList" });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "E2EId", "LocaleName", "MenuPosition", "Name" },
                values: new object[] { "selectable-list", "SelectableList", 1, "Selectable list" });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "E2EId", "Link", "LocaleName", "MenuPosition", "Name" },
                values: new object[] { "application-settings", "/application-settings", "ApplicationSettings", 1, "Application Settings" });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "E2EId", "Link", "MenuPosition", "Name", "ParentId", "Position" },
                values: new object[] { "sign-out-dropdown", "", 2, "user", null, 0 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "E2EId", "Link", "LocaleName", "MenuPosition", "Name", "ParentId", "Position" },
                values: new object[] { "user-management-menu", "/account-management/users", "UserManagement", 2, "User Management", 10, 0 });

            migrationBuilder.UpdateData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "E2EId", "Link", "LocaleName", "MenuPosition", "Name", "ParentId", "Position" },
                values: new object[] { "settings", "/account-management/settings", "Settings", 2, "Settings", 10, 1 });

            migrationBuilder.InsertData(
                table: "MenuItems",
                columns: new[] { "Id", "CreatedAt", "CreatedByUserId", "E2EId", "Link", "LocaleName", "MenuPosition", "Name", "ParentId", "Position", "UpdatedAt", "UpdatedByUserId", "Version", "WorkflowState" },
                values: new object[,]
                {
                    { 18, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "email-recipients", "/email-recipients", "EmailRecipients", 1, "Email Recipients", 3, 7, null, 0, 0, null },
                    { 17, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "folders", "/advanced/folders", "Folders", 1, "Folders", 3, 5, null, 0, 0, null },
                    { 16, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "plugins-settings", "/plugins-settings", "PluginsSettings", 1, "Plugins Settings", 3, 8, null, 0, 0, null },
                    { 15, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "sign-out", "/auth/sign-out", "Logout", 2, "Logout", 10, 4, null, 0, 0, null },
                    { 14, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "change-password", "/account-management/change-password", "ChangePassword", 2, "Change password", 10, 3, null, 0, 0, null },
                    { 13, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0, "security", "/security", "Security", 2, "Security", 10, 2, null, 0, 0, null }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_MenuItems_MenuItems_ParentId",
                table: "MenuItems",
                column: "ParentId",
                principalTable: "MenuItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

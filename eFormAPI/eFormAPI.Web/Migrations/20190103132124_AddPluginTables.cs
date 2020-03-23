/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using eFormAPI.Web.Hosting;


namespace eFormAPI.Web.Migrations
{
    public partial class AddPluginTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var autoIDGenStrategy = "SqlServer:ValueGenerationStrategy";
            object autoIDGenStrategyValue = SqlServerValueGenerationStrategy.IdentityColumn;

            // Setup for MySQL Provider
            if (migrationBuilder.ActiveProvider == "Pomelo.EntityFrameworkCore.MySql")
            {
                DbConfig.IsMySQL = true;
                autoIDGenStrategy = "MySql:ValueGenerationStrategy";
                autoIDGenStrategyValue = MySqlValueGenerationStrategy.IdentityColumn;
            }
            migrationBuilder.DropColumn(
                name: "Position",
                table: "EformReportElements");

            migrationBuilder.DropColumn(
                name: "Visibility",
                table: "EformReportElements");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "EformReports",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "EformPlugins",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation(autoIDGenStrategy, autoIDGenStrategyValue),
                    PluginId = table.Column<string>(maxLength: 100, nullable: false),
                    ConnectionString = table.Column<string>(nullable: true),
                    Status = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EformPlugins", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EformReportDataItems",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation(autoIDGenStrategy, autoIDGenStrategyValue),
                    DataItemId = table.Column<int>(nullable: false),
                    Position = table.Column<int>(nullable: false),
                    Visibility = table.Column<bool>(nullable: false),
                    EformReportElementId = table.Column<int>(nullable: false),
                    ParentId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EformReportDataItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EformReportDataItems_EformReportElements_EformReportElementId",
                        column: x => x.EformReportElementId,
                        principalTable: "EformReportElements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EformReportDataItems_EformReportDataItems_ParentId",
                        column: x => x.ParentId,
                        principalTable: "EformReportDataItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "MenuItems",
                columns: new[] { "Id", "E2EId", "Link", "LocaleName", "MenuPosition", "Name", "ParentId", "Position" },
                values: new object[] { 16, "plugins-settings", "/plugins-settings", "Plugin Settings", 1, "Plugin Settings", 3, 6 });

            migrationBuilder.CreateIndex(
                name: "IX_EformPlugins_PluginId",
                table: "EformPlugins",
                column: "PluginId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EformReportDataItems_DataItemId",
                table: "EformReportDataItems",
                column: "DataItemId");

            migrationBuilder.CreateIndex(
                name: "IX_EformReportDataItems_EformReportElementId",
                table: "EformReportDataItems",
                column: "EformReportElementId");

            migrationBuilder.CreateIndex(
                name: "IX_EformReportDataItems_ParentId",
                table: "EformReportDataItems",
                column: "ParentId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EformPlugins");

            migrationBuilder.DropTable(
                name: "EformReportDataItems");

            migrationBuilder.DeleteData(
                table: "MenuItems",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DropColumn(
                name: "Description",
                table: "EformReports");

            migrationBuilder.AddColumn<int>(
                name: "Position",
                table: "EformReportElements",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "Visibility",
                table: "EformReportElements",
                nullable: false,
                defaultValue: false);
        }
    }
}

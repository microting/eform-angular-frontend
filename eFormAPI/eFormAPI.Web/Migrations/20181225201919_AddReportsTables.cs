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
    public partial class AddReportsTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            string autoIDGenStrategy = "SqlServer:ValueGenerationStrategy";
            object autoIDGenStrategyValue = SqlServerValueGenerationStrategy.IdentityColumn;
            if (DbConfig.IsMySQL)
            {
                autoIDGenStrategy = "MySql:ValueGenerationStrategy";
                autoIDGenStrategyValue = MySqlValueGenerationStrategy.IdentityColumn;
            }
            migrationBuilder.CreateTable(
                name: "EformReports",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation(autoIDGenStrategy, autoIDGenStrategyValue),
                    TemplateId = table.Column<int>(nullable: false),
                    HeaderImage = table.Column<byte[]>(nullable: true),
                    HeaderVisibility = table.Column<string>(nullable: true),
                    IsDateVisible = table.Column<bool>(nullable: false),
                    IsWorkerNameVisible = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EformReports", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EformReportElements",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation(autoIDGenStrategy, autoIDGenStrategyValue),
                    ElementId = table.Column<int>(nullable: false),
                    Position = table.Column<int>(nullable: false),
                    Visibility = table.Column<bool>(nullable: false),
                    EformReportId = table.Column<int>(nullable: false),
                    ParentId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EformReportElements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EformReportElements_EformReports_EformReportId",
                        column: x => x.EformReportId,
                        principalTable: "EformReports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EformReportElements_EformReportElements_ParentId",
                        column: x => x.ParentId,
                        principalTable: "EformReportElements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EformReportElements_EformReportId",
                table: "EformReportElements",
                column: "EformReportId");

            migrationBuilder.CreateIndex(
                name: "IX_EformReportElements_ElementId",
                table: "EformReportElements",
                column: "ElementId");

            migrationBuilder.CreateIndex(
                name: "IX_EformReportElements_ParentId",
                table: "EformReportElements",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_EformReports_TemplateId",
                table: "EformReports",
                column: "TemplateId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EformReportElements");

            migrationBuilder.DropTable(
                name: "EformReports");
        }
    }
}

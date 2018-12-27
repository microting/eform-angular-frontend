using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddedDataItemTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Position",
                table: "EformReportElements");

            migrationBuilder.DropColumn(
                name: "Visibility",
                table: "EformReportElements");

            migrationBuilder.CreateTable(
                name: "EformReportDataItems",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
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
                name: "EformReportDataItems");

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

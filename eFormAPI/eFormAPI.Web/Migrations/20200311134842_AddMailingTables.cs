using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    using Hosting;

    public partial class AddMailingTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            string autoIdGenStrategy = "SqlServer:ValueGenerationStrategy";
            object autoIdGenStrategyValue = SqlServerValueGenerationStrategy.IdentityColumn;
            if (DbConfig.IsMySQL)
            {
                autoIdGenStrategy = "MySql:ValueGenerationStrategy";
                autoIdGenStrategyValue = MySqlValueGenerationStrategy.IdentityColumn;
            }

            migrationBuilder.CreateTable(
                name: "CasePosts",
                columns: table => new
                {
                    Id = table.Column<int>()
                        .Annotation(autoIdGenStrategy, autoIdGenStrategyValue),
                    CreatedAt = table.Column<DateTime>(),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    WorkflowState = table.Column<string>(maxLength: 255, nullable: true),
                    CreatedByUserId = table.Column<int>(),
                    UpdatedByUserId = table.Column<int>(),
                    Version = table.Column<int>(),
                    PostDate = table.Column<DateTime>(),
                    Subject = table.Column<string>(),
                    Text = table.Column<string>(),
                    LinkToCase = table.Column<bool>(),
                    AttachPdf = table.Column<bool>()
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CasePosts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmailRecipients",
                columns: table => new
                {
                    Id = table.Column<int>()
                        .Annotation(autoIdGenStrategy, autoIdGenStrategyValue),
                    CreatedAt = table.Column<DateTime>(),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    WorkflowState = table.Column<string>(maxLength: 255, nullable: true),
                    CreatedByUserId = table.Column<int>(),
                    UpdatedByUserId = table.Column<int>(),
                    Version = table.Column<int>(),
                    Name = table.Column<string>(maxLength: 250),
                    Email = table.Column<string>(maxLength: 250)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailRecipients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmailTags",
                columns: table => new
                {
                    Id = table.Column<int>()
                        .Annotation(autoIdGenStrategy, autoIdGenStrategyValue),
                    CreatedAt = table.Column<DateTime>(),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    WorkflowState = table.Column<string>(maxLength: 255, nullable: true),
                    CreatedByUserId = table.Column<int>(),
                    UpdatedByUserId = table.Column<int>(),
                    Version = table.Column<int>(),
                    Name = table.Column<string>(maxLength: 250)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailTags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CasePostEmailRecipients",
                columns: table => new
                {
                    Id = table.Column<int>()
                        .Annotation(autoIdGenStrategy, autoIdGenStrategyValue),
                    CreatedAt = table.Column<DateTime>(),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    WorkflowState = table.Column<string>(maxLength: 255, nullable: true),
                    CreatedByUserId = table.Column<int>(),
                    UpdatedByUserId = table.Column<int>(),
                    Version = table.Column<int>(),
                    EmailRecipientId = table.Column<int>(),
                    CasePostId = table.Column<int>()
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CasePostEmailRecipients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CasePostEmailRecipients_CasePosts_CasePostId",
                        column: x => x.CasePostId,
                        principalTable: "CasePosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CasePostEmailRecipients_EmailRecipients_EmailRecipientId",
                        column: x => x.EmailRecipientId,
                        principalTable: "EmailRecipients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CasePostEmailTags",
                columns: table => new
                {
                    Id = table.Column<int>()
                        .Annotation(autoIdGenStrategy, autoIdGenStrategyValue),
                    CreatedAt = table.Column<DateTime>(),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    WorkflowState = table.Column<string>(maxLength: 255, nullable: true),
                    CreatedByUserId = table.Column<int>(),
                    UpdatedByUserId = table.Column<int>(),
                    Version = table.Column<int>(),
                    EmailTagId = table.Column<int>(),
                    CasePostId = table.Column<int>()
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CasePostEmailTags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CasePostEmailTags_CasePosts_CasePostId",
                        column: x => x.CasePostId,
                        principalTable: "CasePosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CasePostEmailTags_EmailTags_EmailTagId",
                        column: x => x.EmailTagId,
                        principalTable: "EmailTags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EmailTagRecipients",
                columns: table => new
                {
                    Id = table.Column<int>()
                        .Annotation(autoIdGenStrategy, autoIdGenStrategyValue),
                    CreatedAt = table.Column<DateTime>(),
                    UpdatedAt = table.Column<DateTime>(nullable: true),
                    WorkflowState = table.Column<string>(maxLength: 255, nullable: true),
                    CreatedByUserId = table.Column<int>(),
                    UpdatedByUserId = table.Column<int>(),
                    Version = table.Column<int>(),
                    EmailTagId = table.Column<int>(),
                    EmailRecipientId = table.Column<int>()
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailTagRecipients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmailTagRecipients_EmailRecipients_EmailRecipientId",
                        column: x => x.EmailRecipientId,
                        principalTable: "EmailRecipients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmailTagRecipients_EmailTags_EmailTagId",
                        column: x => x.EmailTagId,
                        principalTable: "EmailTags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CasePostEmailRecipients_CasePostId",
                table: "CasePostEmailRecipients",
                column: "CasePostId");

            migrationBuilder.CreateIndex(
                name: "IX_CasePostEmailRecipients_EmailRecipientId",
                table: "CasePostEmailRecipients",
                column: "EmailRecipientId");

            migrationBuilder.CreateIndex(
                name: "IX_CasePostEmailTags_CasePostId",
                table: "CasePostEmailTags",
                column: "CasePostId");

            migrationBuilder.CreateIndex(
                name: "IX_CasePostEmailTags_EmailTagId",
                table: "CasePostEmailTags",
                column: "EmailTagId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailRecipients_Email",
                table: "EmailRecipients",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_EmailRecipients_Name",
                table: "EmailRecipients",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_EmailTagRecipients_EmailRecipientId",
                table: "EmailTagRecipients",
                column: "EmailRecipientId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailTagRecipients_EmailTagId",
                table: "EmailTagRecipients",
                column: "EmailTagId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailTags_Name",
                table: "EmailTags",
                column: "Name");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CasePostEmailRecipients");

            migrationBuilder.DropTable(
                name: "CasePostEmailTags");

            migrationBuilder.DropTable(
                name: "EmailTagRecipients");

            migrationBuilder.DropTable(
                name: "CasePosts");

            migrationBuilder.DropTable(
                name: "EmailRecipients");

            migrationBuilder.DropTable(
                name: "EmailTags");
        }
    }
}

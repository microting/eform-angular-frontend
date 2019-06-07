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
using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace eFormAPI.Web.Migrations
{
    public partial class AddingNewAttributes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "SecurityGroupUsers",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "SecurityGroupUsers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "SecurityGroupUsers",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                table: "SecurityGroupUsers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "SecurityGroupUsers",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WorkflowState",
                table: "SecurityGroupUsers",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "SecurityGroups",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "SecurityGroups",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "SecurityGroups",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                table: "SecurityGroups",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "SecurityGroups",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WorkflowState",
                table: "SecurityGroups",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "SavedTags",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "SavedTags",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "SavedTags",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                table: "SavedTags",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "SavedTags",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WorkflowState",
                table: "SavedTags",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "PermissionTypes",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "PermissionTypes",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "PermissionTypes",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                table: "PermissionTypes",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "PermissionTypes",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WorkflowState",
                table: "PermissionTypes",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Permissions",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "Permissions",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Permissions",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                table: "Permissions",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "Permissions",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WorkflowState",
                table: "Permissions",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "MenuItems",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "MenuItems",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "MenuItems",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                table: "MenuItems",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "MenuItems",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WorkflowState",
                table: "MenuItems",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "GroupPermissions",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "GroupPermissions",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "GroupPermissions",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                table: "GroupPermissions",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "GroupPermissions",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WorkflowState",
                table: "GroupPermissions",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "EformReports",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "EformReports",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "EformReports",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                table: "EformReports",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "EformReports",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WorkflowState",
                table: "EformReports",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "EformReportElements",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "EformReportElements",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "EformReportElements",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                table: "EformReportElements",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "EformReportElements",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WorkflowState",
                table: "EformReportElements",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "EformReportDataItems",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "EformReportDataItems",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "EformReportDataItems",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                table: "EformReportDataItems",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "EformReportDataItems",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WorkflowState",
                table: "EformReportDataItems",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "EformPlugins",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "EformPlugins",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "EformPlugins",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                table: "EformPlugins",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "EformPlugins",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WorkflowState",
                table: "EformPlugins",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "EformPermissions",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "EformPermissions",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "EformPermissions",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                table: "EformPermissions",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "EformPermissions",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WorkflowState",
                table: "EformPermissions",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "EformInGroups",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "CreatedByUserId",
                table: "EformInGroups",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "EformInGroups",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedByUserId",
                table: "EformInGroups",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Version",
                table: "EformInGroups",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "WorkflowState",
                table: "EformInGroups",
                maxLength: 255,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "SecurityGroupUsers");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "SecurityGroupUsers");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "SecurityGroupUsers");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                table: "SecurityGroupUsers");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "SecurityGroupUsers");

            migrationBuilder.DropColumn(
                name: "WorkflowState",
                table: "SecurityGroupUsers");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "SecurityGroups");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "SecurityGroups");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "SecurityGroups");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                table: "SecurityGroups");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "SecurityGroups");

            migrationBuilder.DropColumn(
                name: "WorkflowState",
                table: "SecurityGroups");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "SavedTags");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "SavedTags");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "SavedTags");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                table: "SavedTags");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "SavedTags");

            migrationBuilder.DropColumn(
                name: "WorkflowState",
                table: "SavedTags");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "PermissionTypes");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "PermissionTypes");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "PermissionTypes");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                table: "PermissionTypes");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "PermissionTypes");

            migrationBuilder.DropColumn(
                name: "WorkflowState",
                table: "PermissionTypes");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Permissions");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "Permissions");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Permissions");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                table: "Permissions");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "Permissions");

            migrationBuilder.DropColumn(
                name: "WorkflowState",
                table: "Permissions");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "WorkflowState",
                table: "MenuItems");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "GroupPermissions");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "GroupPermissions");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "GroupPermissions");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                table: "GroupPermissions");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "GroupPermissions");

            migrationBuilder.DropColumn(
                name: "WorkflowState",
                table: "GroupPermissions");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "EformReports");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "EformReports");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "EformReports");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                table: "EformReports");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "EformReports");

            migrationBuilder.DropColumn(
                name: "WorkflowState",
                table: "EformReports");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "EformReportElements");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "EformReportElements");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "EformReportElements");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                table: "EformReportElements");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "EformReportElements");

            migrationBuilder.DropColumn(
                name: "WorkflowState",
                table: "EformReportElements");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "EformReportDataItems");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "EformReportDataItems");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "EformReportDataItems");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                table: "EformReportDataItems");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "EformReportDataItems");

            migrationBuilder.DropColumn(
                name: "WorkflowState",
                table: "EformReportDataItems");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "EformPlugins");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "EformPlugins");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "EformPlugins");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                table: "EformPlugins");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "EformPlugins");

            migrationBuilder.DropColumn(
                name: "WorkflowState",
                table: "EformPlugins");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "EformPermissions");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "EformPermissions");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "EformPermissions");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                table: "EformPermissions");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "EformPermissions");

            migrationBuilder.DropColumn(
                name: "WorkflowState",
                table: "EformPermissions");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "EformInGroups");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "EformInGroups");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "EformInGroups");

            migrationBuilder.DropColumn(
                name: "UpdatedByUserId",
                table: "EformInGroups");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "EformInGroups");

            migrationBuilder.DropColumn(
                name: "WorkflowState",
                table: "EformInGroups");
        }
    }
}

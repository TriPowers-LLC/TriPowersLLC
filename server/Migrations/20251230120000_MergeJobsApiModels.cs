using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

using TriPowersLLC.Models;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace TriPowersLLC.Migrations
{
    public partial class MergeJobsApiModels : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Jobs table additions
            migrationBuilder.AddColumn<string>(
                name: "Company",
                table: "Jobs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "Jobs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SalaryRange",
                table: "Jobs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Jobs",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ClosingDate",
                table: "Jobs",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Views",
                table: "Jobs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ApplicantsCount",
                table: "Jobs",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Jobs",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Jobs",
                type: "datetime2",
                nullable: true);

            // Applicants table additions
            migrationBuilder.AddColumn<string>(
                name: "ResumeUrl",
                table: "Applicants",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CoverLetter",
                table: "Applicants",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LinkedInProfile",
                table: "Applicants",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PortfolioUrl",
                table: "Applicants",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Message",
                table: "Applicants",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Company", table: "Jobs");
            migrationBuilder.DropColumn(name: "Url", table: "Jobs");
            migrationBuilder.DropColumn(name: "SalaryRange", table: "Jobs");
            migrationBuilder.DropColumn(name: "IsActive", table: "Jobs");
            migrationBuilder.DropColumn(name: "ClosingDate", table: "Jobs");
            migrationBuilder.DropColumn(name: "Views", table: "Jobs");
            migrationBuilder.DropColumn(name: "ApplicantsCount", table: "Jobs");
            migrationBuilder.DropColumn(name: "CreatedAt", table: "Jobs");
            migrationBuilder.DropColumn(name: "UpdatedAt", table: "Jobs");

            migrationBuilder.DropColumn(name: "ResumeUrl", table: "Applicants");
            migrationBuilder.DropColumn(name: "CoverLetter", table: "Applicants");
            migrationBuilder.DropColumn(name: "LinkedInProfile", table: "Applicants");
            migrationBuilder.DropColumn(name: "PortfolioUrl", table: "Applicants");
            migrationBuilder.DropColumn(name: "Message", table: "Applicants");
        }
    }
}

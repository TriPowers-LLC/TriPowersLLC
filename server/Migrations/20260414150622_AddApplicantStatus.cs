using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TriPowersLLC.Migrations
{
    /// <inheritdoc />
    public partial class AddApplicantStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Applicants",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Applicants");
        }
    }
}

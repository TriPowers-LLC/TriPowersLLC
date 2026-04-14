using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TriPowersLLC.Migrations
{
    /// <inheritdoc />
    public partial class AddJobStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Company",
                table: "Jobs",
                newName: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Jobs",
                newName: "Company");
        }
    }
}

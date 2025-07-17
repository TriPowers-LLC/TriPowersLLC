using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TriPowersLLC.Migrations
{
    /// <inheritdoc />
    public partial class ChangedSalarytoSalaryRangeMinandSalaryRangeMax : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Salary",
                table: "Jobs",
                newName: "SalaryRangeMin");

            migrationBuilder.AddColumn<int>(
                name: "SalaryRangeMax",
                table: "Jobs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SalaryRangeMax",
                table: "Jobs");

            migrationBuilder.RenameColumn(
                name: "SalaryRangeMin",
                table: "Jobs",
                newName: "Salary");
        }
    }
}

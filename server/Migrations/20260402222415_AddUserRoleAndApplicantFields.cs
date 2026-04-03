using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TriPowersLLC.Migrations
{
    /// <inheritdoc />
    public partial class AddUserRoleAndApplicantFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "zipCode",
                table: "Applicants",
                newName: "ZipCode");

            migrationBuilder.RenameColumn(
                name: "streetAddress",
                table: "Applicants",
                newName: "StreetAddress");

            migrationBuilder.RenameColumn(
                name: "state",
                table: "Applicants",
                newName: "State");

            migrationBuilder.RenameColumn(
                name: "phone",
                table: "Applicants",
                newName: "Phone");

            migrationBuilder.RenameColumn(
                name: "password",
                table: "Applicants",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "lastName",
                table: "Applicants",
                newName: "LastName");

            migrationBuilder.RenameColumn(
                name: "firstName",
                table: "Applicants",
                newName: "FirstName");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "Applicants",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "country",
                table: "Applicants",
                newName: "Country");

            migrationBuilder.RenameColumn(
                name: "city",
                table: "Applicants",
                newName: "City");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Applicants",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "ResumeText",
                table: "Applicants",
                newName: "FullName");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "ZipCode",
                table: "Applicants",
                type: "varchar(10)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(10)");

            migrationBuilder.AlterColumn<string>(
                name: "StreetAddress",
                table: "Applicants",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Country",
                table: "Applicants",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "ZipCode",
                table: "Applicants",
                newName: "zipCode");

            migrationBuilder.RenameColumn(
                name: "StreetAddress",
                table: "Applicants",
                newName: "streetAddress");

            migrationBuilder.RenameColumn(
                name: "State",
                table: "Applicants",
                newName: "state");

            migrationBuilder.RenameColumn(
                name: "Phone",
                table: "Applicants",
                newName: "phone");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "Applicants",
                newName: "password");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "Applicants",
                newName: "lastName");

            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "Applicants",
                newName: "firstName");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "Applicants",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Country",
                table: "Applicants",
                newName: "country");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "Applicants",
                newName: "city");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Applicants",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "Applicants",
                newName: "ResumeText");

            migrationBuilder.AlterColumn<string>(
                name: "zipCode",
                table: "Applicants",
                type: "nvarchar(10)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "varchar(10)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "streetAddress",
                table: "Applicants",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "country",
                table: "Applicants",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}

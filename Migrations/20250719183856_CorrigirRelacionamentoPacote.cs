using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class CorrigirRelacionamentoPacote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Packages_PackageId_Pacote",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_PackageId_Pacote",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "PackageId_Pacote",
                table: "Reservations");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PackageId_Pacote",
                table: "Reservations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_PackageId_Pacote",
                table: "Reservations",
                column: "PackageId_Pacote");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Packages_PackageId_Pacote",
                table: "Reservations",
                column: "PackageId_Pacote",
                principalTable: "Packages",
                principalColumn: "Id_Pacote");
        }
    }
}

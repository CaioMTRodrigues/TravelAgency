using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class RenomearColunasEntidades : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Evaluations_Packages_PackageId_Package",
                table: "Evaluations");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Packages_PacoteId_Package",
                table: "Reservations");

            migrationBuilder.RenameColumn(
                name: "ID_Usuario",
                table: "Reservations",
                newName: "Id_Usuario");

            migrationBuilder.RenameColumn(
                name: "ID_Reserva",
                table: "Reservations",
                newName: "Id_Reserva");

            migrationBuilder.RenameColumn(
                name: "PacoteId_Package",
                table: "Reservations",
                newName: "PacoteId_Pacote");

            migrationBuilder.RenameColumn(
                name: "Id_Package",
                table: "Reservations",
                newName: "Id_Pacote");

            migrationBuilder.RenameIndex(
                name: "IX_Reservations_PacoteId_Package",
                table: "Reservations",
                newName: "IX_Reservations_PacoteId_Pacote");

            migrationBuilder.RenameColumn(
                name: "Id_Package",
                table: "Packages",
                newName: "Id_Pacote");

            migrationBuilder.RenameColumn(
                name: "PackageId_Package",
                table: "Evaluations",
                newName: "PackageId_Pacote");

            migrationBuilder.RenameColumn(
                name: "IdUsuario",
                table: "Evaluations",
                newName: "Id_Usuario");

            migrationBuilder.RenameColumn(
                name: "IdPacote",
                table: "Evaluations",
                newName: "Id_Pacote");

            migrationBuilder.RenameColumn(
                name: "Id_Evaluation",
                table: "Evaluations",
                newName: "Id_Avaliacao");

            migrationBuilder.RenameIndex(
                name: "IX_Evaluations_PackageId_Package",
                table: "Evaluations",
                newName: "IX_Evaluations_PackageId_Pacote");

            migrationBuilder.AddForeignKey(
                name: "FK_Evaluations_Packages_PackageId_Pacote",
                table: "Evaluations",
                column: "PackageId_Pacote",
                principalTable: "Packages",
                principalColumn: "Id_Pacote");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Packages_PacoteId_Pacote",
                table: "Reservations",
                column: "PacoteId_Pacote",
                principalTable: "Packages",
                principalColumn: "Id_Pacote",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Evaluations_Packages_PackageId_Pacote",
                table: "Evaluations");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Packages_PacoteId_Pacote",
                table: "Reservations");

            migrationBuilder.RenameColumn(
                name: "Id_Usuario",
                table: "Reservations",
                newName: "ID_Usuario");

            migrationBuilder.RenameColumn(
                name: "Id_Reserva",
                table: "Reservations",
                newName: "ID_Reserva");

            migrationBuilder.RenameColumn(
                name: "PacoteId_Pacote",
                table: "Reservations",
                newName: "PacoteId_Package");

            migrationBuilder.RenameColumn(
                name: "Id_Pacote",
                table: "Reservations",
                newName: "Id_Package");

            migrationBuilder.RenameIndex(
                name: "IX_Reservations_PacoteId_Pacote",
                table: "Reservations",
                newName: "IX_Reservations_PacoteId_Package");

            migrationBuilder.RenameColumn(
                name: "Id_Pacote",
                table: "Packages",
                newName: "Id_Package");

            migrationBuilder.RenameColumn(
                name: "PackageId_Pacote",
                table: "Evaluations",
                newName: "PackageId_Package");

            migrationBuilder.RenameColumn(
                name: "Id_Usuario",
                table: "Evaluations",
                newName: "IdUsuario");

            migrationBuilder.RenameColumn(
                name: "Id_Pacote",
                table: "Evaluations",
                newName: "IdPacote");

            migrationBuilder.RenameColumn(
                name: "Id_Avaliacao",
                table: "Evaluations",
                newName: "Id_Evaluation");

            migrationBuilder.RenameIndex(
                name: "IX_Evaluations_PackageId_Pacote",
                table: "Evaluations",
                newName: "IX_Evaluations_PackageId_Package");

            migrationBuilder.AddForeignKey(
                name: "FK_Evaluations_Packages_PackageId_Package",
                table: "Evaluations",
                column: "PackageId_Package",
                principalTable: "Packages",
                principalColumn: "Id_Package");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Packages_PacoteId_Package",
                table: "Reservations",
                column: "PacoteId_Package",
                principalTable: "Packages",
                principalColumn: "Id_Package",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

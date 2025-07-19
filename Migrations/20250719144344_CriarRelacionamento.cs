using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class CriarRelacionamento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Packages_PacoteId_Pacote",
                table: "Reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Users_UsuarioId_User",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_PacoteId_Pacote",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_UsuarioId_User",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "PacoteId_Pacote",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "UsuarioId_User",
                table: "Reservations");

            migrationBuilder.AddColumn<int>(
                name: "PackageId_Pacote",
                table: "Reservations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_Id_Pacote",
                table: "Reservations",
                column: "Id_Pacote");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_Id_Usuario",
                table: "Reservations",
                column: "Id_Usuario");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_PackageId_Pacote",
                table: "Reservations",
                column: "PackageId_Pacote");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Packages_Id_Pacote",
                table: "Reservations",
                column: "Id_Pacote",
                principalTable: "Packages",
                principalColumn: "Id_Pacote",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Packages_PackageId_Pacote",
                table: "Reservations",
                column: "PackageId_Pacote",
                principalTable: "Packages",
                principalColumn: "Id_Pacote");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Users_Id_Usuario",
                table: "Reservations",
                column: "Id_Usuario",
                principalTable: "Users",
                principalColumn: "Id_User",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Packages_Id_Pacote",
                table: "Reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Packages_PackageId_Pacote",
                table: "Reservations");

            migrationBuilder.DropForeignKey(
                name: "FK_Reservations_Users_Id_Usuario",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_Id_Pacote",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_Id_Usuario",
                table: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Reservations_PackageId_Pacote",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "PackageId_Pacote",
                table: "Reservations");

            migrationBuilder.AddColumn<int>(
                name: "PacoteId_Pacote",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UsuarioId_User",
                table: "Reservations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_PacoteId_Pacote",
                table: "Reservations",
                column: "PacoteId_Pacote");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_UsuarioId_User",
                table: "Reservations",
                column: "UsuarioId_User");

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Packages_PacoteId_Pacote",
                table: "Reservations",
                column: "PacoteId_Pacote",
                principalTable: "Packages",
                principalColumn: "Id_Pacote",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reservations_Users_UsuarioId_User",
                table: "Reservations",
                column: "UsuarioId_User",
                principalTable: "Users",
                principalColumn: "Id_User",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

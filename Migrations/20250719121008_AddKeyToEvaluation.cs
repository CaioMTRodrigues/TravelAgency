using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class AddKeyToEvaluation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Users",
                newName: "Id_User");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Packages",
                newName: "Id_Package");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Evaluations",
                newName: "Id_Evaluation");

            migrationBuilder.AddColumn<int>(
                name: "PackageId_Package",
                table: "Evaluations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Reservations",
                columns: table => new
                {
                    ID_Reserva = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Data_Reserva = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Numero_Reserva = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ID_Usuario = table.Column<int>(type: "int", nullable: false),
                    UsuarioId_User = table.Column<int>(type: "int", nullable: false),
                    ID_Pacote = table.Column<int>(type: "int", nullable: false),
                    PacoteId_Package = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservations", x => x.ID_Reserva);
                    table.ForeignKey(
                        name: "FK_Reservations_Packages_PacoteId_Package",
                        column: x => x.PacoteId_Package,
                        principalTable: "Packages",
                        principalColumn: "Id_Package",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reservations_Users_UsuarioId_User",
                        column: x => x.UsuarioId_User,
                        principalTable: "Users",
                        principalColumn: "Id_User",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Evaluations_PackageId_Package",
                table: "Evaluations",
                column: "PackageId_Package");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_PacoteId_Package",
                table: "Reservations",
                column: "PacoteId_Package");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_UsuarioId_User",
                table: "Reservations",
                column: "UsuarioId_User");

            migrationBuilder.AddForeignKey(
                name: "FK_Evaluations_Packages_PackageId_Package",
                table: "Evaluations",
                column: "PackageId_Package",
                principalTable: "Packages",
                principalColumn: "Id_Package");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Evaluations_Packages_PackageId_Package",
                table: "Evaluations");

            migrationBuilder.DropTable(
                name: "Reservations");

            migrationBuilder.DropIndex(
                name: "IX_Evaluations_PackageId_Package",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "PackageId_Package",
                table: "Evaluations");

            migrationBuilder.RenameColumn(
                name: "Id_User",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "Id_Package",
                table: "Packages",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "Id_Evaluation",
                table: "Evaluations",
                newName: "Id");
        }
    }
}

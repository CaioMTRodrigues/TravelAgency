using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Packages",
                columns: table => new
                {
                    Id_Pacote = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Titulo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Destino = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DuracaoDias = table.Column<int>(type: "int", nullable: false),
                    DataInicio = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataFim = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Valor = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    ImagemUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Packages", x => x.Id_Pacote);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id_User = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Document = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id_User);
                });

            migrationBuilder.CreateTable(
                name: "Evaluations",
                columns: table => new
                {
                    Id_Avaliacao = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nota = table.Column<double>(type: "float", nullable: false),
                    Comentario = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Data = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Id_Usuario = table.Column<int>(type: "int", nullable: false),
                    Id_Pacote = table.Column<int>(type: "int", nullable: false),
                    PackageId_Pacote = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Evaluations", x => x.Id_Avaliacao);
                    table.ForeignKey(
                        name: "FK_Evaluations_Packages_Id_Pacote",
                        column: x => x.Id_Pacote,
                        principalTable: "Packages",
                        principalColumn: "Id_Pacote",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Evaluations_Packages_PackageId_Pacote",
                        column: x => x.PackageId_Pacote,
                        principalTable: "Packages",
                        principalColumn: "Id_Pacote");
                    table.ForeignKey(
                        name: "FK_Evaluations_Users_Id_Usuario",
                        column: x => x.Id_Usuario,
                        principalTable: "Users",
                        principalColumn: "Id_User",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reservations",
                columns: table => new
                {
                    Id_Reserva = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Data_Reserva = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Numero_Reserva = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Id_Usuario = table.Column<int>(type: "int", nullable: false),
                    Id_Pacote = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservations", x => x.Id_Reserva);
                    table.ForeignKey(
                        name: "FK_Reservations_Packages_Id_Pacote",
                        column: x => x.Id_Pacote,
                        principalTable: "Packages",
                        principalColumn: "Id_Pacote",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reservations_Users_Id_Usuario",
                        column: x => x.Id_Usuario,
                        principalTable: "Users",
                        principalColumn: "Id_User",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Evaluations_Id_Pacote",
                table: "Evaluations",
                column: "Id_Pacote");

            migrationBuilder.CreateIndex(
                name: "IX_Evaluations_Id_Usuario",
                table: "Evaluations",
                column: "Id_Usuario");

            migrationBuilder.CreateIndex(
                name: "IX_Evaluations_PackageId_Pacote",
                table: "Evaluations",
                column: "PackageId_Pacote");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_Id_Pacote",
                table: "Reservations",
                column: "Id_Pacote");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_Id_Usuario",
                table: "Reservations",
                column: "Id_Usuario");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Evaluations");

            migrationBuilder.DropTable(
                name: "Reservations");

            migrationBuilder.DropTable(
                name: "Packages");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}

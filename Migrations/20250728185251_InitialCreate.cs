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
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Document = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EmailConfirmationToken = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TokenExpiration = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
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
                    Id_Usuario = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Id_Pacote = table.Column<int>(type: "int", nullable: false)
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
                        name: "FK_Evaluations_Users_Id_Usuario",
                        column: x => x.Id_Usuario,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reservations",
                columns: table => new
                {
                    Id_Reserva = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Data_Reserva = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Numero_Reserva = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ValorPacote = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    Id_Usuario = table.Column<string>(type: "nvarchar(450)", nullable: false),
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
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Travelers",
                columns: table => new
                {
                    Id_Viajante = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Documento = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Data_Nascimento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Id_Usuario = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Travelers", x => x.Id_Viajante);
                    table.ForeignKey(
                        name: "FK_Travelers_Users_Id_Usuario",
                        column: x => x.Id_Usuario,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id_Pagamento = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Tipo = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Valor = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Data_Pagamento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Id_Reserva = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id_Pagamento);
                    table.ForeignKey(
                        name: "FK_Payments_Reservations_Id_Reserva",
                        column: x => x.Id_Reserva,
                        principalTable: "Reservations",
                        principalColumn: "Id_Reserva",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReservationTravelers",
                columns: table => new
                {
                    Id_Reserva = table.Column<int>(type: "int", nullable: false),
                    Id_Viajante = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReservationTravelers", x => new { x.Id_Reserva, x.Id_Viajante });
                    table.ForeignKey(
                        name: "FK_ReservaViajante_Reservation_Id_Reserva",
                        column: x => x.Id_Reserva,
                        principalTable: "Reservations",
                        principalColumn: "Id_Reserva");
                    table.ForeignKey(
                        name: "FK_ReservaViajante_Traveler_Id_Viajante",
                        column: x => x.Id_Viajante,
                        principalTable: "Travelers",
                        principalColumn: "Id_Viajante");
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
                name: "IX_Payments_Id_Reserva",
                table: "Payments",
                column: "Id_Reserva");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_Id_Pacote",
                table: "Reservations",
                column: "Id_Pacote");

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_Id_Usuario",
                table: "Reservations",
                column: "Id_Usuario");

            migrationBuilder.CreateIndex(
                name: "IX_ReservationTravelers_Id_Viajante",
                table: "ReservationTravelers",
                column: "Id_Viajante");

            migrationBuilder.CreateIndex(
                name: "IX_Travelers_Id_Usuario",
                table: "Travelers",
                column: "Id_Usuario");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Document",
                table: "Users",
                column: "Document",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Evaluations");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "ReservationTravelers");

            migrationBuilder.DropTable(
                name: "Reservations");

            migrationBuilder.DropTable(
                name: "Travelers");

            migrationBuilder.DropTable(
                name: "Packages");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}

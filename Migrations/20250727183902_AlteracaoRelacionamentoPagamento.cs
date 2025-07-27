using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class AlteracaoRelacionamentoPagamento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Payments_Id_Reserva",
                table: "Payments");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_Id_Reserva",
                table: "Payments",
                column: "Id_Reserva");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Payments_Id_Reserva",
                table: "Payments");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_Id_Reserva",
                table: "Payments",
                column: "Id_Reserva",
                unique: true);
        }
    }
}

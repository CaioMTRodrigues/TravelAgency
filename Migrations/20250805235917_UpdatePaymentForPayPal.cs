using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePaymentForPayPal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Payments",
                table: "Payments");

            migrationBuilder.RenameTable(
                name: "Payments",
                newName: "Pagamentos");

            migrationBuilder.RenameColumn(
                name: "StripePaymentIntentId",
                table: "Pagamentos",
                newName: "PayPalOrderId");

            migrationBuilder.RenameIndex(
                name: "IX_Payments_Id_Reserva",
                table: "Pagamentos",
                newName: "IX_Pagamentos_Id_Reserva");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Pagamentos",
                table: "Pagamentos",
                column: "Id_Pagamento");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Pagamentos",
                table: "Pagamentos");

            migrationBuilder.RenameTable(
                name: "Pagamentos",
                newName: "Payments");

            migrationBuilder.RenameColumn(
                name: "PayPalOrderId",
                table: "Payments",
                newName: "StripePaymentIntentId");

            migrationBuilder.RenameIndex(
                name: "IX_Pagamentos_Id_Reserva",
                table: "Payments",
                newName: "IX_Payments_Id_Reserva");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Payments",
                table: "Payments",
                column: "Id_Pagamento");
        }
    }
}

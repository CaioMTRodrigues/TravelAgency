using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApplication1.Migrations
{
    /// <inheritdoc />
    public partial class CorrigeRelacionamentoEvaluationPackage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Evaluations_Packages_PackageId_Pacote",
                table: "Evaluations");

            migrationBuilder.DropIndex(
                name: "IX_Evaluations_PackageId_Pacote",
                table: "Evaluations");

            migrationBuilder.DropColumn(
                name: "PackageId_Pacote",
                table: "Evaluations");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PackageId_Pacote",
                table: "Evaluations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Evaluations_PackageId_Pacote",
                table: "Evaluations",
                column: "PackageId_Pacote");

            migrationBuilder.AddForeignKey(
                name: "FK_Evaluations_Packages_PackageId_Pacote",
                table: "Evaluations",
                column: "PackageId_Pacote",
                principalTable: "Packages",
                principalColumn: "Id_Pacote");
        }
    }
}

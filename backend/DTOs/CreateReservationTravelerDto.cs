// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 20/07/2025
// 📁 Arquivo: CreateReservationTravelerDto
// 📦 Projeto: TravelAgency
// 🚀 Descrição: DTO para criação de vínculo entre Reserva e Viajante
// -----------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations;

namespace WebApplication1.backend.DTOs
{
    public class CreateReservationTravelerDto
    {
        
{
        [Required(ErrorMessage = "O ID da reserva é obrigatório.")]
        public int Id_Reserva { get; set; }

        [Required(ErrorMessage = "O ID do viajante é obrigatório.")]
        public int Id_Viajante { get; set; }
    }

}
}

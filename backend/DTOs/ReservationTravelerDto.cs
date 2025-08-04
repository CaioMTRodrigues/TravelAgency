// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 20/07/2025
// 📁 Arquivo: ReservationTravelerDto
// 📦 Projeto: TravelAgency
// 🚀 Descrição: DTO para exibição do vínculo entre Reserva e Viajante
// -----------------------------------------------------------------------------

using WebApplication1.Entities;

namespace WebApplication1.backend.DTOs
{
    public class ReservationTravelerDto
    {

        public int Id_Reserva { get; set; }
        public Reservation Reserva { get; set; }

        public int Id_Viajante { get; set; }
        public Traveler Viajante { get; set; }

    }

}

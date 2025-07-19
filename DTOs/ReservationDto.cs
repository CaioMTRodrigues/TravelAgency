// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 19/07/2025
// 📁 Arquivo: ReservationDto
// 📦 Projeto: TravelAgency
// 🚀  Descrição: Pega a Entidade Reservation e converte em ReservationDto
// -----------------------------------------------------------------------------

namespace WebApplication1.DTOs
{
    public class ReservationDto

    {
        public int Id_Reserva { get; set; }
        public DateTime Data_Reserva { get; set; }
        public StatusReserva Status { get; set; }
        public string Numero_Reserva { get; set; }
        public int Id_Usuario { get; set; }
        public int Id_Pacote { get; set; }
    }
}

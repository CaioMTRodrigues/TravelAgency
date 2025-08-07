// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 19/07/2025
// 📁 Arquivo: ReservationDto
// 📦 Projeto: TravelAgency
// 🚀  Descrição: Pega a Entidade Reservation e converte em ReservationDto
// -----------------------------------------------------------------------------

using WebApplication1.Entities;

namespace WebApplication1.DTOs
{
    public class ReservationDto

    {
        public int Id_Reserva { get; set; }
        public DateTime Data_Reserva { get; set; }
        public StatusReserva Status { get; set; }
        public string Numero_Reserva { get; set; }
        public PackageDto Pacote { get; set; }
        public UserLoginDTO User { get; set; }
        public string NomeUsuario { get; set; }

        public string Id_Usuario { get; set; }

        public int Id_Pacote { get; set; }

    }
}

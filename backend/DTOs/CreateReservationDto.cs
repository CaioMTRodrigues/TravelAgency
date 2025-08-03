// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 27/07/2025
// 📁 Arquivo: CreateReservationDto.cs
// 📦 Projeto: TravelAgency
// 🚀 Descrição: DTO para criação de reservas
// -----------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations;
using WebApplication1.Entities;

namespace WebApplication1.DTOs
{
    public class CreateReservationDto
    {
        public CreateReservationDto()
        {
            Numero_Reserva = GerarNumeroReserva();
        }

        public DateTime? Data_Reserva { get; set; }

        public StatusReserva Status { get; set; } = StatusReserva.Pendente;

        public string Numero_Reserva { get; private set; }

        [Required(ErrorMessage = "O ID do usuário é obrigatório.")]
        public string Id_Usuario { get; set; }

        [Required(ErrorMessage = "O ID do pacote é obrigatório.")]
        public int Id_Pacote { get; set; }

        private string GerarNumeroReserva()
        {
            var prefixo = "TravelAgency";
            var data = DateTime.Now.ToString("yyyyMMddHHmmss");
            var aleatorio = new Random().Next(1000, 9999);
            return $"{prefixo}-{data}-{aleatorio}";
        }
    }
}

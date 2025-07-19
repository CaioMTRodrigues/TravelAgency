// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 19/07/2025
// 📁 Arquivo: CreateReservationDto
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Pega a Entidade ReservationDto e converte em Reservation e Validações
// -----------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DTOs
{
    public class CreateReservationDto
    {
        
        [Required(ErrorMessage = "A data da reserva é obrigatória.")]
        public DateTime Data_Reserva { get; set; }

        [Required(ErrorMessage = "O status da reserva é obrigatório.")]
        [EnumDataType(typeof(StatusReserva), ErrorMessage = "Status inválido.")]
        public StatusReserva Status { get; set; }

        [Required(ErrorMessage = "O número da reserva é obrigatório.")]
        [StringLength(50, ErrorMessage = "O número da reserva deve ter no máximo 50 caracteres.")]
        public string Numero_Reserva { get; set; }

        [Required(ErrorMessage = "O ID do usuário é obrigatório.")]
        public int ID_Usuario { get; set; }

        [Required(ErrorMessage = "O ID do pacote é obrigatório.")]
        public int ID_Pacote { get; set; }
    }

    public enum StatusReserva
    {
        Pendente,
        Confirmada,
        Cancelada,
        Concluida
    }
}


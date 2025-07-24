using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DTOs
{
    public class CreateReservationDto
    {
        public CreateReservationDto()
        {
            Numero_Reserva = GerarNumeroReserva();
        }

        [Required(ErrorMessage = "A data da reserva é obrigatória.")]
        public DateTime Data_Reserva { get; set; }

        [Required(ErrorMessage = "O status da reserva é obrigatório.")]
        [EnumDataType(typeof(StatusReserva), ErrorMessage = "Status inválido.")]
        public StatusReserva Status { get; set; } = StatusReserva.Pendente;

        [Required(ErrorMessage = "O número da reserva é obrigatório.")]
        [StringLength(50, ErrorMessage = "O número da reserva deve ter no máximo 50 caracteres.")]
        public string Numero_Reserva { get; private set; }

        [Required(ErrorMessage = "O ID do usuário é obrigatório.")]
        public int Id_Usuario { get; set; }

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

    public enum StatusReserva
    {
        Pendente,
        Confirmada,
        Cancelada,
        Concluida
    }
}

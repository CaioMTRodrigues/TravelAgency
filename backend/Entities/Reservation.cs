using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebApplication1.backend.Entities;

namespace WebApplication1.Entities
{
    public enum StatusReserva
    {
        Pendente,
        Confirmada,
        Cancelada,
        Concluida
    }

    public class Reservation
    {
        [Key]
        public int Id_Reserva { get; set; }
        public DateTime Data_Reserva { get; set; }
        public StatusReserva Status { get; set; }
        public string Numero_Reserva { get; set; }

        // Novo campo para manter o valor do pacote no momento da reserva
        [Precision(10, 2)]
        public decimal ValorPacote { get; set; }

        // Relacionamentos
        public int Id_Usuario { get; set; }
        public User Usuario { get; set; }

        public int Id_Pacote { get; set; }
        public Package Pacote { get; set; }

        public ICollection<ReservationTraveler> ReservaViajantes { get; set; }
        public Payment Pagamento { get; set; }
    }
}

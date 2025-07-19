// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 19/07/2025
// 📁 Arquivo: Reservation
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Classe Reservation e seus atributos
// -----------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations;

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

        // Relacionamentos
        public int Id_Usuario { get; set; }
        public User Usuario { get; set; }

        public int Id_Pacote { get; set; }
        public Package Pacote { get; set; }

        /*
        public ICollection<ReservaViajante> ReservaViajantes { get; set; }
        public Pagamento Pagamento { get; set; }
        */

    }
}

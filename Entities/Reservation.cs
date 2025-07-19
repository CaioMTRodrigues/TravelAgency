// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 19/07/2025
// 📁 Arquivo: Reservation
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Classe Reservation e seus atributos
// -----------------------------------------------------------------------------

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

        public int ID_Reserva { get; set; }
        public DateTime Data_Reserva { get; set; }
        public StatusReserva Status { get; set; }
        public string Numero_Reserva { get; set; }

        // Relacionamentos
        public int ID_Usuario { get; set; }
        public User Usuario { get; set; }

        public int ID_Pacote { get; set; }
        public Package Pacote { get; set; }

        public ICollection<ReservaViajante> ReservaViajantes { get; set; }
        public Pagamento Pagamento { get; set; }

    }
}

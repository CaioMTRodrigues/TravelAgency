// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 19/07/2025
// 📁 Arquivo: PaymentDto
// 📦 Projeto: TravelAgency
// 🚀 Descrição: DTO para exibição de pagamento
// -----------------------------------------------------------------------------

using WebApplication1.Entities;

namespace WebApplication1.DTOs
{
    public class PaymentDto
    {
        public int Id_Pagamento { get; set; }

        public TipoPagamento Tipo { get; set; }

        public StatusPagamento Status { get; set; }

        public decimal Valor { get; set; }

        public DateTime Data_Pagamento { get; set; }

        public int Id_Reserva { get; set; }
    }
}

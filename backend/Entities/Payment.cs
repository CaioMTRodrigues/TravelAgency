// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 19/07/2025
// 📁 Arquivo: Payment
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Entidade PAGAMENTO, atributos e relacionamento com Reserva
// -----------------------------------------------------------------------------

using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Entities
{
    // Enum para os tipos de pagamento disponíveis
    public enum TipoPagamento
    {
        Cartao_Credito,   // Pagamento via cartão de crédito 
        Cartao_Debito,    // Pagamento via cartoa de débito
        Pix,              // Pagamento instantâneo via Pix
        Boleto            // Pagamento via boleto bancário
    }

    // Enum para os status possíveis de um pagamento
    public enum StatusPagamento
    {
        Pago,       // Pagamento concluído com sucesso
        Pendente,   // Pagamento ainda não realizado
        Cancelado   // Pagamento cancelado
    }

    public class Payment
    {
        [Key]
        public int Id_Pagamento { get; set; }

        public TipoPagamento Tipo { get; set; }
        public StatusPagamento Status { get; set; }
        public decimal Valor { get; set; }
        public DateTime Data_Pagamento { get; set; }

        public int Id_Reserva { get; set; }

        [ForeignKey("Id_Reserva")]
        public Reservation Reserva { get; set; }
    }
}

// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 19/07/2025
// 📁 Arquivo: CreatePaymentDto
// 📦 Projeto: TravelAgency
// 🚀 Descrição: DTO para criação de pagamento com validações
// -----------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations;
using WebApplication1.Entities;

namespace WebApplication1.DTOs
{
    public class CreatePaymentDto
    {
        [Required(ErrorMessage = "O tipo de pagamento é obrigatório.")]
        [EnumDataType(typeof(TipoPagamento), ErrorMessage = "Tipo de pagamento inválido.")]
        public TipoPagamento Tipo { get; set; }

        [Required(ErrorMessage = "O status do pagamento é obrigatório.")]
        [EnumDataType(typeof(StatusPagamento), ErrorMessage = "Status de pagamento inválido.")]
        public StatusPagamento Status { get; set; }

        [Required(ErrorMessage = "O valor é obrigatório.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
        public decimal Valor { get; set; }

        [Required(ErrorMessage = "A data de pagamento é obrigatória.")]
        public DateTime Data_Pagamento { get; set; }

        [Required(ErrorMessage = "O ID da reserva é obrigatório.")]
        public int Id_Reserva { get; set; }
    }
}

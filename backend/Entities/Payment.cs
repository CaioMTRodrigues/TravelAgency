using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WebApplication1.Entities
{
    // Enum para os tipos de pagamento
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum TipoPagamento
    {
        Cartao_Credito,
        Boleto,
        Transferencia_Bancaria,
        PayPal // <-- ADICIONADO AQUI
    }

    // Enum para os status do pagamento
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum StatusPagamento
    {
        Pendente,
        Aprovado, // <-- ADICIONADO AQUI
        Falhou,   // <-- ADICIONADO AQUI
        Cancelado
    }

    [Table("Pagamentos")]
    public class Payment
    {
        [Key]
        public int Id_Pagamento { get; set; }

        [Required]
        [ForeignKey("Reservation")]
        public int Id_Reserva { get; set; }
        public virtual Reservation Reservation { get; set; }

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Valor { get; set; }

        [Required]
        public DateTime Data_Pagamento { get; set; }

        [Required]
        public StatusPagamento Status { get; set; }

        [Required]
        public TipoPagamento Tipo { get; set; }

        // Campo para armazenar o ID da ordem do PayPal
        public string? PayPalOrderId { get; set; }
        public string? StripePaymentIntentId { get; internal set; }

        // O campo do Stripe pode ser removido ou mantido para referência histórica, se necessário.
        // Se for removê-lo, lembre-se de criar uma nova migração.
        // public string? StripePaymentIntentId { get; set; }
    }
}

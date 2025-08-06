namespace WebApplication1.DTOs
{
    public class PaymentRequestDto
    {
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "brl";
        public int ReservationId { get; set; }
    }
}
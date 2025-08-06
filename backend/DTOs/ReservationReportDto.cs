namespace WebApplication1.DTOs
{
    public class ReservationReportDto
    {
        public int Id_Reserva { get; set; }
        public string Numero_Reserva { get; set; }
        public DateTime Data_Reserva { get; set; }
        public string Status_Reserva { get; set; }
        public string Nome_Cliente { get; set; }
        public string Email_Cliente { get; set; }
        public string Nome_Pacote { get; set; }
        public string Destino_Pacote { get; set; }
        public decimal Valor_Total { get; set; }
        public string Status_Pagamento { get; set; }
        public string Metodo_Pagamento { get; set; }
    }
}
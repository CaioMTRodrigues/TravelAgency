using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Entities;

namespace WebApplication1.backend.Services
{
    public class PaymentService
    {


        private readonly ApplicationDbContext _context;

        public PaymentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Payment> RegistrarPagamentoAsync(CreatePaymentDto dto)
        {
            var pagamento = new Payment
            {
                Id_Reserva = dto.Id_Reserva,
                Valor = dto.Valor,
                Tipo = dto.Tipo,
                Status = StatusPagamento.Pendente,
                Data_Pagamento = DateTime.UtcNow
            };

            _context.Payments.Add(pagamento);
            await _context.SaveChangesAsync();

            return pagamento;
        }





    }
}

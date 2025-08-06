using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Data;
using WebApplication1.Entities;

namespace WebApplication1.Repositories
{
    public class PaymentRepository : IRepository<Payment, int>
    {
        private readonly ApplicationDbContext _context;

        public PaymentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Payment>> GetAllAsync()
        {
            return await _context.Payments.ToListAsync();
        }

        public async Task<Payment> GetByIdAsync(int id)
        {
            return await _context.Payments.FindAsync(id);
        }

        public async Task AddAsync(Payment entity)
        {
            await _context.Payments.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Payment entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Payments.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        // --- MÉTODO NOVO AQUI ---
        /// <summary>
        /// Busca um pagamento no banco de dados pelo ID da ordem do PayPal.
        /// </summary>
        public async Task<Payment> GetByPayPalOrderIdAsync(string orderId)
        {
            return await _context.Payments
                .FirstOrDefaultAsync(p => p.PayPalOrderId == orderId);
        }
        // --- FIM DO NOVO MÉTODO ---
    }
}

// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 19/07/2025
// 📁 Arquivo: PaymentRepository
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Repositório para operações CRUD da entidade Payment
// -----------------------------------------------------------------------------

using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Entities;

namespace WebApplication1.Repositories
{
    public class PaymentRepository : IRepository<Payment, int>
    {
        private readonly ApplicationDbContext _appDbContext;

        // Injeta o contexto do banco de dados
        public PaymentRepository(ApplicationDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        // Retorna todos os pagamentos cadastrados
        public async Task<IEnumerable<Payment>> GetAllAsync()
        {
            return await _appDbContext.Payments.ToListAsync();
        }

        // Busca um pagamento pelo ID
        public async Task<Payment?> GetByIdAsync(int id)
        {
            return await _appDbContext.Payments.FindAsync(id);
        }

        // Adiciona um novo pagamento
        public async Task AddAsync(Payment entity)
        {
            await _appDbContext.Payments.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();
        }

        // Atualiza um pagamento existente
        public async Task UpdateAsync(Payment entity)
        {
            _appDbContext.Payments.Update(entity);
            await _appDbContext.SaveChangesAsync();
        }

        // Remove um pagamento pelo ID
        public async Task DeleteAsync(int id)
        {
            var payment = await GetByIdAsync(id);

            if (payment != null)
            {
                _appDbContext.Payments.Remove(payment);
                await _appDbContext.SaveChangesAsync();
            }
        }
    }
}

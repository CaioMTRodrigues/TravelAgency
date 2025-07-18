// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 18/07/2025
// 📁 Arquivo: EvaluationRepository
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Repositório para operações CRUD da entidade Evaluation
// -----------------------------------------------------------------------------

using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Entities;

namespace WebApplication1.Repositories
{
    public class EvaluationRepository : IRepository<Evaluation, int>
    {
        private readonly ApplicationDbContext _appDbContext;

        public EvaluationRepository(ApplicationDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<IEnumerable<Evaluation>> GetAllAsync()
        {
            return await _appDbContext.Evaluations.ToListAsync();
        }

        public async Task<Evaluation?> GetByIdAsync(int id)
        {
            return await _appDbContext.Evaluations.FindAsync(id);
        }

        public async Task AddAsync(Evaluation entity)
        {
            await _appDbContext.Evaluations.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(Evaluation entity)
        {
            _appDbContext.Evaluations.Update(entity);
            await _appDbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var evaluation = await GetByIdAsync(id);
            if (evaluation != null)
            {
                _appDbContext.Evaluations.Remove(evaluation);
                await _appDbContext.SaveChangesAsync();
            }
        }
    }
}

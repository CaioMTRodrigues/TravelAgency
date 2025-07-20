// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 20/07/2025
// 📁 Arquivo: TravelerRepository
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Repositório para operações CRUD da entidade Traveler
// -----------------------------------------------------------------------------

using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Entities;

namespace WebApplication1.Repositories
{
    public class TravelerRepository : IRepository<Traveler, int>
    {
        private readonly ApplicationDbContext _appDbContext;

        // Injeta o contexto do banco de dados
        public TravelerRepository(ApplicationDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        // Retorna todos os viajantes cadastrados
        public async Task<IEnumerable<Traveler>> GetAllAsync()
        {
            return await _appDbContext.Travelers.ToListAsync();
        }

        // Busca um viajante pelo ID
        public async Task<Traveler?> GetByIdAsync(int id)
        {
            return await _appDbContext.Travelers.FindAsync(id);
        }

        // Adiciona um novo viajante
        public async Task AddAsync(Traveler entity)
        {
            await _appDbContext.Travelers.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();
        }

        // Atualiza um viajante existente
        public async Task UpdateAsync(Traveler entity)
        {
            _appDbContext.Travelers.Update(entity);
            await _appDbContext.SaveChangesAsync();
        }

        // Remove um viajante pelo ID
        public async Task DeleteAsync(int id)
        {
            var traveler = await GetByIdAsync(id);

            if (traveler != null)
            {
                _appDbContext.Travelers.Remove(traveler);
                await _appDbContext.SaveChangesAsync();
            }
        }
    }
}
// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 18/07/2025
// 📁 Arquivo: PackageRepository
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Repositório para operações CRUD da entidade Package
// -----------------------------------------------------------------------------

using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Entities;

namespace WebApplication1.Repositories
{
    public class PackageRepository : IRepository<Package, int>
    {
        private readonly ApplicationDbContext _appDbContext;

        // Injeta o contexto do banco de dados
        public PackageRepository(ApplicationDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        // Retorna todos os pacotes cadastrados
        public async Task<IEnumerable<Package>> GetAllAsync()
        {
            return await _appDbContext.Packages.ToListAsync();
        }

        // Busca um pacote pelo ID
        public async Task<Package?> GetByIdAsync(int id)
        {
            return await _appDbContext.Packages.FindAsync(id);
        }

        // Adiciona um novo pacote
        public async Task AddAsync(Package entity)
        {
            await _appDbContext.Packages.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();
        }

        // Atualiza um pacote existente
        public async Task UpdateAsync(Package entiyt)
        {
            _appDbContext.Packages.Update(entiyt);
            await _appDbContext.SaveChangesAsync();
        }

        // Remove um pacote pelo ID
        public async Task DeleteAsync(int id)
        {
            var package = await GetByIdAsync(id);

            if (package != null)
            {
                _appDbContext.Packages.Remove(package);
                await _appDbContext.SaveChangesAsync();
            }
        }
    }
}

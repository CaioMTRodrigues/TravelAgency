// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 18/07/2025
// 📁 Arquivo: IRepository
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Interface genérica para operações básicas de repositório
// -----------------------------------------------------------------------------

namespace WebApplication1.Repositories
{
    public interface IRepository<T, TId> where T : class
    {
        // Retorna todos os registros
        Task<IEnumerable<T>> GetAllAsync();

        // Retorna um registro pelo ID
        Task<T?> GetByIdAsync(TId id);

        // Adiciona um novo registro
        Task AddAsync(T entity);

        // Atualiza um registro existente
        Task UpdateAsync(T entity);

        // Remove um registro pelo ID
        Task DeleteAsync(TId id);
    }
}

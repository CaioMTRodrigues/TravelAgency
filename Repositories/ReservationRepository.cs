// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 19/07/2025
// 📁 Arquivo: ReservaRepository
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Repositório para operações CRUD da entidade Reserva
// -----------------------------------------------------------------------------

using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Entities;

namespace WebApplication1.Repositories
{

    public class ReservationRepository : IRepository<Reservation, int>
    {
        private readonly ApplicationDbContext _appDbContext;

        public ReservationRepository(ApplicationDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<IEnumerable<Reservation>> GetAllAsync()
        {
            return await _appDbContext.Reservations
                .Include(r => r.Usuario)
                .Include(r => r.Pacote)
                .Include(r => r.ReservaViajantes)
                .Include(r => r.Pagamento)
                .ToListAsync();
        }

        public async Task<Reservation?> GetByIdAsync(int id)
        {
            return await _appDbContext.Reservations
                .Include(r => r.Usuario)
                .Include(r => r.Pacote)
                .Include(r => r.ReservaViajantes)
                .Include(r => r.Pagamento)
                .FirstOrDefaultAsync(r => r.ID_Reserva == id);
        }

        public async Task AddAsync(Reservation entity)
        {
            await _appDbContext.Reservations.AddAsync(entity);
            await _appDbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(Reservation entity)
        {
            _appDbContext.Reservations.Update(entity);
            await _appDbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var reserva = await GetByIdAsync(id);

            if (reserva != null)
            {
                _appDbContext.Reservations.Remove(reserva);
                await _appDbContext.SaveChangesAsync();
            }
        }
    }
}

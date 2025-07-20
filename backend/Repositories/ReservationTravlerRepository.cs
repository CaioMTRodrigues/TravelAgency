// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 20/07/2025
// 📁 Arquivo: ReservationTravelerRepository
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Repositório para gerenciar vínculos entre Reservas e Viajantes
// -----------------------------------------------------------------------------

using Microsoft.EntityFrameworkCore;
using WebApplication1.backend.Entities;
using WebApplication1.Data;

namespace WebApplication1.Repositories
{
    public class ReservationTravelerRepository
    {
        private readonly ApplicationDbContext _context;

        public ReservationTravelerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ReservationTraveler>> GetAllAsync()
        {
            return await _context.ReservaViajantes
                .Include(rv => rv.Reserva)
                .Include(rv => rv.Viajante)
                .ToListAsync();
        }

        public async Task<ReservationTraveler?> GetByIdsAsync(int idReserva, int idViajante)
        {
            return await _context.ReservaViajantes
                .FirstOrDefaultAsync(rv => rv.Id_Reserva == idReserva && rv.Id_Viajante == idViajante);
        }

        public async Task AddAsync(ReservationTraveler reservationTraveler)
        {
            _context.ReservaViajantes.Add(reservationTraveler);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveAsync(ReservationTraveler reservationTraveler)
        {
            _context.ReservaViajantes.Remove(reservationTraveler);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int idReserva, int idViajante)
        {
            return await _context.ReservaViajantes
                .AnyAsync(rv => rv.Id_Reserva == idReserva && rv.Id_Viajante == idViajante);
        }
    }
}

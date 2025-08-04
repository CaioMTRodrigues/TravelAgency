// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 20/07/2025
// 📁 Arquivo: ReservationTravelerRepository
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Repositório específico para gerenciar vínculos entre reservas e viajantes
// -----------------------------------------------------------------------------

using Microsoft.EntityFrameworkCore;
using WebApplication1.backend.DTOs;
using WebApplication1.backend.Entities;
using WebApplication1.Data;
using WebApplication1.Exceptions;

namespace WebApplication1.Repositories
{
    public class ReservationTravelerRepository
    {
        private readonly ApplicationDbContext _appDbContext;

        // Injeta o contexto do banco de dados
        public ReservationTravelerRepository(ApplicationDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        // Retorna todos os vínculos entre reservas e viajantes
        public async Task<IEnumerable<ReservationTraveler>> GetAllAsync()
        {
            return await _appDbContext.ReservationTravelers
                .Include(rv => rv.Reserva)
                .Include(rv => rv.Viajante)
                .ToListAsync();
        }

        // Busca um vínculo específico por ID de reserva e ID de viajante (chave composta)
        public async Task<ReservationTraveler?> GetByIdsAsync(int idReserva, int idViajante)
        {
            return await _appDbContext.ReservationTravelers
                .FirstOrDefaultAsync(rv => rv.Id_Reserva == idReserva && rv.Id_Viajante == idViajante);
        }

        // Adiciona um novo vínculo entre reserva e viajante
        public async Task AddAsync(CreateReservationTravelerDto dto)
        {
            var reservaExiste = await _appDbContext.Reservations.AnyAsync(r => r.Id_Reserva == dto.Id_Reserva);
            var viajanteExiste = await _appDbContext.Travelers.AnyAsync(v => v.Id_Viajante == dto.Id_Viajante);

            if (!reservaExiste || !viajanteExiste)
                throw new BusinessException("Reserva ou Viajante não encontrados.");

            var reservaViajante = new ReservationTraveler
            {
                Id_Reserva = dto.Id_Reserva,
                Id_Viajante = dto.Id_Viajante
            };

            _appDbContext.ReservationTravelers.Add(reservaViajante);
            await _appDbContext.SaveChangesAsync();
        }


        // Remove um vínculo existente
        public async Task RemoveAsync(ReservationTraveler entity)
        {
            _appDbContext.ReservationTravelers.Remove(entity);
            await _appDbContext.SaveChangesAsync();
        }

        // Verifica se o vínculo já existe (evita duplicidade)
        // Verifica se o vínculo já existe (evita duplicidade)
        public async Task<bool> ExistsAsync(int idReserva, int idViajante)
        {
            return await _appDbContext.ReservationTravelers
                .AnyAsync(rv => rv.Id_Reserva == idReserva && rv.Id_Viajante == idViajante);
        }
    }
}

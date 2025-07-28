// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 27/07/2025
// 📁 Arquivo: ReservationService.cs
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Serviço responsável pelas regras de negócio relacionadas a reservas
// -----------------------------------------------------------------------------

using Microsoft.EntityFrameworkCore;
using Volo.Abp;
using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Exceptions;
using BusinessException = WebApplication1.Exceptions.BusinessException;

namespace WebApplication1.Services
{
    public class ReservationService
    {
        private readonly ApplicationDbContext _context;

        public ReservationService(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🔍 Retorna todas as reservas com dados relacionados
        public async Task<IEnumerable<Reservation>> ObterTodasAsync()
        {
            return await _context.Reservations
                .Include(r => r.Usuario)
                .Include(r => r.Pacote)
                .Include(r => r.ReservaViajantes)
                    .ThenInclude(rv => rv.Viajante)
                .ToListAsync();
        }

        // 🔍 Retorna uma reserva específica pelo ID
        public async Task<Reservation?> ObterPorIdAsync(int id)
        {
            return await _context.Reservations
                .Include(r => r.Usuario)
                .Include(r => r.Pacote)
                .Include(r => r.ReservaViajantes)
                    .ThenInclude(rv => rv.Viajante)
                .Include(r => r.Pagamentos)
                .FirstOrDefaultAsync(r => r.Id_Reserva == id);
        }

        // 🆕 Cria uma nova reserva com validações e uso dos dados do DTO
        public async Task<Reservation> CriarReservaAsync(CreateReservationDto dto)
        {
            // 🔎 Valida existência do usuário
            var usuario = await _context.Users.FindAsync(dto.Id_Usuario);
            if (usuario == null)
                throw new NotFoundException("Usuário", dto.Id_Usuario);

            // 🔎 Valida existência do pacote
            var pacote = await _context.Packages.FindAsync(dto.Id_Pacote);
            if (pacote == null)
                throw new NotFoundException("Pacote", dto.Id_Pacote);

            // 🏗️ Cria a reserva
            var reserva = new Reservation
            {
                Id_Usuario = dto.Id_Usuario.ToString(),
                Id_Pacote = dto.Id_Pacote,
                Data_Reserva = dto.Data_Reserva ?? DateTime.UtcNow,
                Status = dto.Status,
                Numero_Reserva = dto.Numero_Reserva,
                ValorPacote = pacote.Valor
            };

            _context.Reservations.Add(reserva);
            await _context.SaveChangesAsync();

            return reserva;
        }

        // ✏️ Atualiza os dados de uma reserva existente
        public async Task<bool> AtualizarReservaAsync(int id, CreateReservationDto dto)
        {
            // 🔎 Valida existência da reserva
            var reserva = await _context.Reservations.FindAsync(id);
            if (reserva == null)
                throw new NotFoundException("Reserva", id);

            // 🔎 Valida existência do pacote
            var pacote = await _context.Packages.FindAsync(dto.Id_Pacote);
            if (pacote == null)
                throw new NotFoundException("Pacote", dto.Id_Pacote);

            // 🛠️ Atualiza os dados
            reserva.Id_Usuario = dto.Id_Usuario.ToString();
            reserva.Id_Pacote = dto.Id_Pacote;
            reserva.ValorPacote = pacote.Valor;
            reserva.Status = dto.Status;

            await _context.SaveChangesAsync();
            return true;
        }

        // ❌ Remove uma reserva do banco de dados
        public async Task<bool> ExcluirReservaAsync(int id)
        {
            // 🔎 Valida existência da reserva
            var reserva = await _context.Reservations.FindAsync(id);
            if (reserva == null)
                throw new NotFoundException("Reserva", id);

            _context.Reservations.Remove(reserva);
            await _context.SaveChangesAsync();
            return true;
        }

        //Método para efetuar pagamentos
        public async Task RegistrarPagamentosAsync(int idReserva, List<Payment> pagamentos)
        {
            var reserva = await _context.Reservations
                .Include(r => r.Pagamentos)
                .FirstOrDefaultAsync(r => r.Id_Reserva == idReserva);

            if (reserva == null)
                throw new NotFoundException("Reserva", idReserva);

            decimal totalExistente = reserva.Pagamentos.Sum(p => p.Valor);
            decimal totalNovo = pagamentos.Sum(p => p.Valor);
            decimal totalFinal = totalExistente + totalNovo;

            if (totalFinal > reserva.ValorPacote)
                throw new BusinessException("O valor total dos pagamentos excede o valor da reserva.");

            foreach (var pagamento in pagamentos)
            {
                pagamento.Id_Reserva = idReserva;
                pagamento.Data_Pagamento = DateTime.UtcNow;
                _context.Payments.Add(pagamento);
            }

            if (totalFinal == reserva.ValorPacote)
            {
                reserva.Status = StatusReserva.Concluida;
            }
            await _context.SaveChangesAsync();
        }
    }
}
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;         
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Exceptions;
using WebApplication1.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ReservationService _reservationService;
        private readonly ApplicationDbContext _context; // Adicionada a injeção do DbContext

        public ReservationController(IMapper mapper, ReservationService reservationService, ApplicationDbContext context)
        {
            _mapper = mapper;
            _reservationService = reservationService;
            _context = context;
        }

        // --- MÉTODOS PARA O PAINEL DE ADMIN ---

        // GET: api/reservation/admin
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetAllAdmin()
        {
            var reservations = await _context.Reservations
                .Include(r => r.Pacote)
                .Include(r => r.Usuario)
                .OrderByDescending(r => r.Data_Reserva)
                .ToListAsync();

            var result = _mapper.Map<IEnumerable<ReservationDto>>(reservations);
            return Ok(result);
        }

        // PUT: api/reservation/{id}/status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateReservationStatusDto statusDto)
        {
            var reservation = await _context.Reservations.FindAsync(id);

            if (reservation == null)
            {
                return NotFound();
            }

            if (System.Enum.TryParse<StatusReserva>(statusDto.Status, true, out var newStatus))
            {
                reservation.Status = newStatus;
                await _context.SaveChangesAsync();
                return NoContent();
            }

            return BadRequest("Status inválido.");
        }

        // PUT: api/reservation/{id}/cancel - Endpoint para usuários cancelarem suas próprias reservas
        [HttpPut("{id}/cancel")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> CancelUserReservation(int id)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return BadRequest("ID do usuário não encontrado no token.");
            }

            var reservation = await _context.Reservations.FindAsync(id);

            if (reservation == null)
            {
                return NotFound("Reserva não encontrada.");
            }

            // Verifica se a reserva pertence ao usuário logado (ou se é admin)
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            if (userRole != "Admin" && reservation.Id_Usuario != userIdClaim)
            {
                return Forbid("Você não tem permissão para cancelar esta reserva.");
            }

            // Verifica se a reserva pode ser cancelada
            if (reservation.Status == StatusReserva.Cancelada)
            {
                return BadRequest("Esta reserva já está cancelada.");
            }

            if (reservation.Status == StatusReserva.Concluida)
            {
                return BadRequest("Não é possível cancelar uma reserva concluída.");
            }

            reservation.Status = StatusReserva.Cancelada;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Reserva cancelada com sucesso." });
        }


        // --- MÉTODOS EXISTENTES FORAM MANTIDOS ABAIXO ---

        // GET: api/reservation/user
        [HttpGet("user")]
        [Authorize(Roles = "User,Admin")]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetUserReservations()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return BadRequest("ID do usuário não encontrado no token.");
            }

            var reservations = await _context.Reservations
                .Include(r => r.Pacote)
                .Include(r => r.Usuario)
                .Where(r => r.Id_Usuario == userIdClaim)
                .OrderByDescending(r => r.Data_Reserva)
                .ToListAsync();

            var result = _mapper.Map<IEnumerable<ReservationDto>>(reservations);
            return Ok(result);
        }

        // GET: api/reservation
        [HttpGet]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetAll()
        {
            var reservations = await _reservationService.ObterTodasAsync();
            var result = _mapper.Map<IEnumerable<ReservationDto>>(reservations);
            return Ok(result);
        }

        // GET: api/reservation/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult<ReservationDto>> GetById(int id)
        {
            var reservation = await _reservationService.ObterPorIdAsync(id);
            if (reservation == null)
                throw new NotFoundException("Reserva", id);

            var dto = _mapper.Map<ReservationDto>(reservation);
            return Ok(dto);
        }

        // POST: api/reservation
        [HttpPost]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult> Create([FromBody] CreateReservationDto dto)
        {
            var reservation = await _reservationService.CriarReservaAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = reservation.Id_Reserva }, _mapper.Map<ReservationDto>(reservation));
        }

        // PUT: api/reservation/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult> Update(int id, CreateReservationDto dto)
        {
            var updated = await _reservationService.AtualizarReservaAsync(id, dto);
            if (!updated)
                throw new NotFoundException("Reserva", id);

            return NoContent();
        }

        // DELETE: api/reservation/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _reservationService.ExcluirReservaAsync(id);
            if (!deleted)
                throw new NotFoundException("Reserva", id);

            return NoContent();
        }

        // POST: api/reservation/{id}/pagamentos
        [HttpPost("{id}/payments")]
        public async Task<IActionResult> RegistrarPagamentos(int id, [FromBody] List<CreatePaymentDto> pagamentosDto)
        {
            var pagamentos = pagamentosDto.Select(dto => new Payment
            {
                Tipo = dto.Tipo,
                Status = dto.Status,
                Valor = dto.Valor,
                Data_Pagamento = dto.Data_Pagamento
            }).ToList();

            await _reservationService.RegistrarPagamentosAsync(id, pagamentos);
            return Ok(new { message = "Pagamentos registrados com sucesso!" });
        }
    }

    // DTO auxiliar para receber o novo status
    public class UpdateReservationStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }
}

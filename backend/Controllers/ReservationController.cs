using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Exceptions;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationController : ControllerBase
    {
        private readonly IRepository<Reservation, int> _repository;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ReservationController(IRepository<Reservation, int> repository, ApplicationDbContext context, IMapper mapper)
        {
            _repository = repository;
            _context = context;
            _mapper = mapper;
        }

        // GET: api/reservation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetAll()
        {
            var reservations = await _repository.GetAllAsync();
            var result = _mapper.Map<IEnumerable<ReservationDto>>(reservations);
            return Ok(result);
        }

        // GET: api/reservation/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ReservationDto>> GetById(int id)
        {
            var reservation = await _repository.GetByIdAsync(id);
            if (reservation == null)
                throw new NotFoundException("Reserva", id);

            var dto = _mapper.Map<ReservationDto>(reservation);
            return Ok(dto);
        }

        // POST: api/reservation
        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateReservationDto dto)
        {
            var pacote = await _context.Packages.FindAsync(dto.Id_Pacote);
            if (pacote == null)
                return BadRequest(new { message = "Pacote não encontrado." });

            var reservation = _mapper.Map<Reservation>(dto);
            reservation.Data_Reserva = DateTime.UtcNow;
            reservation.Status = StatusReserva.Pendente;
            reservation.ValorPacote = pacote.Valor;

            await _repository.AddAsync(reservation);

            return CreatedAtAction(nameof(GetById), new { id = reservation.Id_Reserva }, dto);
        }

        // PUT: api/reservation/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, CreateReservationDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("Reserva", id);

            _mapper.Map(dto, existing);
            await _repository.UpdateAsync(existing);

            return NoContent();
        }

        // DELETE: api/reservation/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("Reserva", id);

            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}

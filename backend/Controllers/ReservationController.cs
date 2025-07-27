using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Exceptions;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ReservationService _reservationService;

        public ReservationController(IMapper mapper, ReservationService reservationService)
        {
            _mapper = mapper;
            _reservationService = reservationService;
        }

        // GET: api/reservation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetAll()
        {
            var reservations = await _reservationService.ObterTodasAsync();
            var result = _mapper.Map<IEnumerable<ReservationDto>>(reservations);
            return Ok(result);
        }

        // GET: api/reservation/{id}
        [HttpGet("{id}")]
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
        public async Task<ActionResult> Create([FromBody] CreateReservationDto dto)
        {
            var reservation = await _reservationService.CriarReservaAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = reservation.Id_Reserva }, _mapper.Map<ReservationDto>(reservation));
        }

        // PUT: api/reservation/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, CreateReservationDto dto)
        {
            var updated = await _reservationService.AtualizarReservaAsync(id, dto);
            if (!updated)
                throw new NotFoundException("Reserva", id);

            return NoContent();
        }

        // DELETE: api/reservation/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var deleted = await _reservationService.ExcluirReservaAsync(id);
            if (!deleted)
                throw new NotFoundException("Reserva", id);

            return NoContent();
        }
    }
}

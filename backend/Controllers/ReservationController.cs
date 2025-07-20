// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 19/07/2025
// 📁 Arquivo: ReservationController
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Controller responsável por gerenciar reservas
// -----------------------------------------------------------------------------

using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Repositories;
using AutoMapper;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Define a rota como: api/reservation
    public class ReservationController : ControllerBase
    {
        private readonly IRepository<Reservation, int> _repository;
        private readonly IMapper _mapper;

        public ReservationController(IRepository<Reservation, int> repository, IMapper mapper)
        {
            _repository = repository;
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
                return NotFound();

            var dto = _mapper.Map<ReservationDto>(reservation);
            return Ok(dto);
        }

        // POST: api/reservation
        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateReservationDto dto)
        {
            var reservation = _mapper.Map<Reservation>(dto);
            await _repository.AddAsync(reservation);

            return CreatedAtAction(nameof(GetById), new { id = reservation.Id_Reserva }, dto);
        }

        // PUT: api/reservation/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, CreateReservationDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

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
                return NotFound();

            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}

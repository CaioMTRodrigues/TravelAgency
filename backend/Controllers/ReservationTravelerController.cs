// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 20/07/2025
// 📁 Arquivo: ReservationTravelerController
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Controller responsável por gerenciar vínculos entre reservas e viajantes
// -----------------------------------------------------------------------------

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.backend.DTOs;
using WebApplication1.backend.Entities;
using WebApplication1.DTOs;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Rota: api/reservationtraveler
    public class ReservationTravelerController : ControllerBase
    {
        private readonly ReservationTravelerRepository _repository;
        private readonly IMapper _mapper;

        public ReservationTravelerController(ReservationTravelerRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET: api/reservationtraveler
        // Retorna todos os vínculos entre reservas e viajantes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservationTravelerDto>>> GetAll()
        {
            var entities = await _repository.GetAllAsync();
            var dtos = _mapper.Map<IEnumerable<ReservationTravelerDto>>(entities);
            return Ok(dtos);
        }

        // GET: api/reservationtraveler/{idReserva}/{idViajante}
        // Retorna um vínculo específico por chave composta
        [HttpGet("{idReserva}/{idViajante}")]
        public async Task<ActionResult<ReservationTravelerDto>> GetByIds(int idReserva, int idViajante)
        {
            var entity = await _repository.GetByIdsAsync(idReserva, idViajante);
            if (entity == null)
                return NotFound();

            var dto = _mapper.Map<ReservationTravelerDto>(entity);
            return Ok(dto);
        }

        // POST: api/reservationtraveler
        // Cria um novo vínculo entre reserva e viajante
        [HttpPost]
        public async Task<ActionResult> Create(CreateReservationTravelerDto dto)
        {
            if (await _repository.ExistsAsync(dto.Id_Reserva, dto.Id_Viajante))
                return Conflict("Esse vínculo já existe.");

            var entity = _mapper.Map<ReservationTraveler>(dto);
            await _repository.AddAsync(entity);

            return CreatedAtAction(nameof(GetByIds), new { idReserva = dto.Id_Reserva, idViajante = dto.Id_Viajante }, dto);
        }

        // DELETE: api/reservationtraveler/{idReserva}/{idViajante}
        // Remove um vínculo entre reserva e viajante
        [HttpDelete("{idReserva}/{idViajante}")]
        public async Task<ActionResult> Delete(int idReserva, int idViajante)
        {
            var entity = await _repository.GetByIdsAsync(idReserva, idViajante);
            if (entity == null)
                return NotFound();

            await _repository.RemoveAsync(entity);
            return NoContent();
        }
    }
}

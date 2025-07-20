// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 20/07/2025
// 📁 Arquivo: TravelerController
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Controller responsável por gerenciar viajantes
// -----------------------------------------------------------------------------

using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.backend.DTOs;
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Define a rota como: api/traveler
    public class TravelerController : ControllerBase
    {
        private readonly IRepository<Traveler, int> _repository;
        private readonly IMapper _mapper;

        // Construtor com injeção de dependência do repositório e do AutoMapper
        public TravelerController(IRepository<Traveler, int> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET: api/traveler
        // Retorna todos os viajantes cadastrados
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TravelerDto>>> GetAll()
        {
            var travelers = await _repository.GetAllAsync();
            var result = _mapper.Map<IEnumerable<TravelerDto>>(travelers);
            return Ok(result);
        }

        // GET: api/traveler/{id}
        // Retorna um viajante específico pelo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<TravelerDto>> GetById(int id)
        {
            var traveler = await _repository.GetByIdAsync(id);
            if (traveler == null)
                return NotFound();

            var dto = _mapper.Map<TravelerDto>(traveler);
            return Ok(dto);
        }

        // POST: api/traveler
        // Cria um novo viajante
        [HttpPost]
        public async Task<ActionResult> Create(CreateTravelerDto dto)
        {
            var traveler = _mapper.Map<Traveler>(dto);
            await _repository.AddAsync(traveler);

            return CreatedAtAction(nameof(GetById), new { id = traveler.Id_Viajante }, dto);
        }

        // PUT: api/traveler/{id}
        // Atualiza um viajante existente
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, CreateTravelerDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            _mapper.Map(dto, existing);
            await _repository.UpdateAsync(existing);

            return NoContent(); // 204 - Atualização bem-sucedida
        }

        // DELETE: api/traveler/{id}
        // Remove um viajante pelo ID
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            await _repository.DeleteAsync(id);
            return NoContent(); // 204 - Exclusão bem-sucedida
        }
    }
}

// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 20/07/2025
// 📁 Arquivo: TravelerController
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Controller responsável por gerenciar viajantes
// -----------------------------------------------------------------------------

using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.backend.DTOs;
using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Exceptions;
using WebApplication1.Repositories;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Define a rota como: api/traveler
    public class TravelerController : ControllerBase
    {
        private readonly IRepository<Traveler, int> _repository;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _appDbContext;


        // Construtor com injeção de dependência do repositório e do AutoMapper

        public TravelerController(IRepository<Traveler, int> repository, IMapper mapper, ApplicationDbContext appDbContext)
        {
            _repository = repository;
            _mapper = mapper;
            _appDbContext = appDbContext;
        }


        // GET: api/traveler
        // Retorna todos os viajantes cadastrados
        [HttpGet]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult<IEnumerable<TravelerDto>>> GetAll()
        {
            var travelers = await _repository.GetAllAsync();
            var result = _mapper.Map<IEnumerable<TravelerDto>>(travelers);
            return Ok(result);
        }

        // GET: api/traveler/{id}
        // Retorna um viajante específico pelo ID
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult<TravelerDto>> GetById(int id)
        {
            var traveler = await _repository.GetByIdAsync(id);
            if (traveler == null)
                throw new NotFoundException("Viajante", id);

            var dto = _mapper.Map<TravelerDto>(traveler);
            return Ok(dto);
        }

        // POST: api/traveler
        // Cria um novo viajante
        [HttpPost]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult> Create(CreateTravelerDto dto)
        {
            try
            {



                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var traveler = _mapper.Map<Traveler>(dto);
                await _repository.AddAsync(traveler);

                Console.WriteLine($"Tentando salvar viajante: {traveler.Nome}, {traveler.Documento}, {traveler.Data_Nascimento}, {traveler.Id_Usuario}");


                var result = _mapper.Map<TravelerDto>(traveler);
                return CreatedAtAction(nameof(GetById), new { id = traveler.Id_Viajante }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno ao cadastrar viajante: {ex.Message}");
            }
        }



        // PUT: api/traveler/{id}
        // Atualiza um viajante existente
        [HttpPut("{id}")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> Update(int id, CreateTravelerDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("Viajante", id);

            _mapper.Map(dto, existing);
            await _repository.UpdateAsync(existing);

            return NoContent(); // 204 - Atualização bem-sucedida
        }

        // DELETE: api/traveler/{id}
        // Remove um viajante pelo ID
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult> Delete(int id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("Viajante", id);

            await _repository.DeleteAsync(id);
            return NoContent(); // 204 - Exclusão bem-sucedida
        }

       

        // Removed the duplicate method definition for GetByUsuario
        [HttpGet("usuario/{idUsuario}")]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult<IEnumerable<TravelerDto>>> GetByUsuario(string idUsuario)
        {
            try
            {
                Console.WriteLine($"Buscando viajantes do usuário: {idUsuario}");

                var travelers = await _appDbContext.Travelers
                    .Where(t => t.Id_Usuario == idUsuario)
                    .ToListAsync();

                if (travelers == null || !travelers.Any())
                    return Ok(new List<TravelerDto>()); // Retorna lista vazia sem erro

                var result = _mapper.Map<IEnumerable<TravelerDto>>(travelers);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar viajantes: {ex.Message}");
                return StatusCode(500, $"Erro interno ao buscar viajantes: {ex.Message}");
            }
        }


        [HttpGet("busca")]
        public async Task<IActionResult> BuscarPorNome([FromQuery] string nome, [FromQuery] string idUsuario)
        {
            Console.WriteLine("Recebido nome para busca: " + nome);
            Console.WriteLine("Recebido idUsuario para busca: " + idUsuario);

            var viajantes = await _appDbContext.Travelers
                .Where(v => v.Nome.Contains(nome) && v.Id_Usuario == idUsuario)
                .ToListAsync();

            var result = _mapper.Map<IEnumerable<TravelerDto>>(viajantes);
            return Ok(result);
        }






    }




}

using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Exceptions;
using WebApplication1.Repositories;
using WebApplication1.Services;
using System.Linq; // Adicionado para usar OrderByDescending e Take

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Define a rota como: api/package
    public class PackageController : ControllerBase
    {
        private readonly IRepository<Package, int> _repository;
        private readonly IMapper _mapper;
        private readonly PackageService _service;


        // Construtor com injeção de dependência do repositório e do AutoMapper
        public PackageController(IRepository<Package, int> repository, IMapper mapper,
            PackageService service)
        {
            _repository = repository;
            _mapper = mapper;
            _service = service;
        }

        // GET: api/package
        // Retorna todos os pacotes cadastrados
        [HttpGet]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult<IEnumerable<PackageDto>>> GetAll()
        {
            var packages = await _repository.GetAllAsync();
            var result = _mapper.Map<IEnumerable<PackageDto>>(packages);
            return Ok(result);
        }

        // NOVO MÉTODO ADICIONADO AQUI
        // GET: api/package/recentes
        // Retorna os 6 pacotes mais recentes para a HomePage
        [HttpGet("recentes")]
        [AllowAnonymous] // Permite que qualquer pessoa (mesmo não logada) veja os pacotes
        public async Task<ActionResult<IEnumerable<PackageDto>>> GetRecentPackages()
        {
            var allPackages = await _repository.GetAllAsync();

            // Ordena os pacotes pelo ID (do maior para o menor) e pega os 6 primeiros
            var recentPackages = allPackages
                .OrderByDescending(p => p.Id_Pacote)
                .Take(6);

            var result = _mapper.Map<IEnumerable<PackageDto>>(recentPackages);
            return Ok(result);
        }

        // GET: api/package/{id}
        // Retorna um pacote específico pelo ID
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult<PackageDto>> GetById(int id)
        {
            var package = await _repository.GetByIdAsync(id);
            if (package == null)
                throw new NotFoundException("Pacote", id);

            var dto = _mapper.Map<PackageDto>(package);
            return Ok(dto);
        }

        // POST: api/package
        // Cria um novo pacote
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Create(CreatePackageDto dto)
        {
            try
            {
                var package = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = package.Id_Pacote }, dto);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao cadastrar pacote: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: api/package/{id}
        // Atualiza um pacote existente
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Update(int id, CreatePackageDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("Pacote", id);

            // Atualiza os dados do pacote com base no DTO recebido
            _mapper.Map(dto, existing);
            await _repository.UpdateAsync(existing);

            return NoContent(); // 204 - Atualização bem-sucedida
        }

        // DELETE: api/package/{id}
        // Remove um pacote pelo ID
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(int id, CreatePackageDto dto)
        {
            await _service.UpdateAsync(id, dto);
            return NoContent();
        }
    }
}
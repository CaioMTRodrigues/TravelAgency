using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Adicionado para consultas diretas
using WebApplication1.Data;         // Adicionado para o DbContext
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Exceptions;
using WebApplication1.Repositories;
using WebApplication1.Services;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackageController : ControllerBase
    {
        private readonly IRepository<Package, int> _repository;
        private readonly IMapper _mapper;
        private readonly PackageService _service;
        private readonly ApplicationDbContext _context; 

        public PackageController(IRepository<Package, int> repository, IMapper mapper,
            PackageService service, ApplicationDbContext context)
        {
            _repository = repository;
            _mapper = mapper;
            _service = service;
            _context = context; 
        }

        // GET: api/package
        [HttpGet]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult<IEnumerable<PackageDto>>> GetAll()
        {
            var packages = await _repository.GetAllAsync();
            var result = _mapper.Map<IEnumerable<PackageDto>>(packages);
            return Ok(result);
        }

        // GET: api/package/destaques
        [HttpGet("destaques")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<PackageDto>>> GetDestaques()
        {
            var destaquePackages = await _context.Packages
                .Where(p => p.Destaque == true) // Filtra apenas os pacotes em destaque
                .OrderByDescending(p => p.Id_Pacote)
                .Take(6) // Limita a 6 destaques
                .ToListAsync();

            var result = _mapper.Map<IEnumerable<PackageDto>>(destaquePackages);
            return Ok(result);
        }

        [HttpPut("{id}/destaque")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateDestaqueStatus(int id, [FromBody] bool destaque)
        {
            var package = await _context.Packages.FindAsync(id);
            if (package == null)
            {
                return NotFound();
            }

            // Limita a 6 destaques: se já houver 6 e estivermos a adicionar um novo
            var currentDestaques = await _context.Packages.CountAsync(p => p.Destaque && p.Id_Pacote != id);
            if (destaque && currentDestaques >= 6)
            {
                return BadRequest("Limite de 6 pacotes em destaque atingido. Remova um destaque existente para adicionar um novo.");
            }

            package.Destaque = destaque;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: api/package/{id}
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
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Update(int id, CreatePackageDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("Pacote", id);

            _mapper.Map(dto, existing);
            await _repository.UpdateAsync(existing);

            return NoContent();
        }

        // DELETE: api/package/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(int id)
        {
            var package = await _repository.GetByIdAsync(id);
            if (package == null)
                return NotFound();

            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}
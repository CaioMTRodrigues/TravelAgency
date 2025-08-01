// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 18/07/2025
// 📁 Arquivo: PackageController
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Controller responsável por gerenciar pacotes turísticos
// -----------------------------------------------------------------------------

using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Exceptions;
using WebApplication1.Repositories;
using WebApplication1.Services;

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

            var package = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = package.Id_Pacote }, dto);

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
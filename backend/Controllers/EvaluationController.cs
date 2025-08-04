using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Adicionado para usar o .Include()
using WebApplication1.Data;         // Adicionado para ter acesso ao DbContext
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Exceptions;
using WebApplication1.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Define a rota como: api/evaluation
    public class EvaluationController : ControllerBase
    {
        private readonly IRepository<Evaluation, int> _repository;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;

        public EvaluationController(IRepository<Evaluation, int> repository, IMapper mapper, ApplicationDbContext context)
        {
            _repository = repository;
            _mapper = mapper;
            _context = context; 
        }
        // GET: api/evaluation/admin
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<EvaluationDto>>> GetAllAdmin()
        {
            var evaluations = await _context.Evaluations
                .Include(e => e.Usuario)
                .Include(e => e.Pacote)  
                .OrderByDescending(e => e.Data) 
                .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<EvaluationDto>>(evaluations));
        }

        // GET: api/evaluation
        [HttpGet]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult<IEnumerable<EvaluationDto>>> GetAll()
        {
            var evaluations = await _repository.GetAllAsync();
            var result = _mapper.Map<IEnumerable<EvaluationDto>>(evaluations);
            return Ok(result);
        }

        // GET: api/evaluation/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<EvaluationDto>> GetById(int id)
        {
            var evaluation = await _repository.GetByIdAsync(id);
            if (evaluation == null)
                throw new NotFoundException("Avaliação", id);

            var dto = _mapper.Map<EvaluationDto>(evaluation);
            return Ok(dto);
        }

        // POST: api/evaluation
        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> Create(CreateEvaluationDto dto)
        {
            var evaluation = _mapper.Map<Evaluation>(dto);
            await _repository.AddAsync(evaluation);

            return CreatedAtAction(nameof(GetById), new { id = evaluation.Id_Avaliacao }, _mapper.Map<EvaluationDto>(evaluation));
        }

        // PUT: api/evaluation/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Update(int id, CreateEvaluationDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("Avaliação", id);

            _mapper.Map(dto, existing);
            await _repository.UpdateAsync(existing);

            return NoContent();
        }

        // DELETE: api/evaluation/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(int id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("Avaliação", id);

            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}
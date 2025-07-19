// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 19/07/2025
// 📁 Arquivo: PaymentController
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Controller responsável por gerenciar pagamentos
// -----------------------------------------------------------------------------

using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Repositories;
using AutoMapper;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Define a rota como: api/payment
    public class PaymentController : ControllerBase
    {
        private readonly IRepository<Payment, int> _repository;
        private readonly IMapper _mapper;

        // Construtor com injeção de dependência do repositório e do AutoMapper
        public PaymentController(IRepository<Payment, int> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET: api/payment
        // Retorna todos os pagamentos cadastrados
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetAll()
        {
            var payments = await _repository.GetAllAsync();
            var result = _mapper.Map<IEnumerable<PaymentDto>>(payments);
            return Ok(result);
        }

        // GET: api/payment/{id}
        // Retorna um pagamento específico pelo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentDto>> GetById(int id)
        {
            var payment = await _repository.GetByIdAsync(id);
            if (payment == null)
                return NotFound();

            var dto = _mapper.Map<PaymentDto>(payment);
            return Ok(dto);
        }

        // POST: api/payment
        // Cria um novo pagamento
        [HttpPost]
        public async Task<ActionResult> Create(CreatePaymentDto dto)
        {
            var payment = _mapper.Map<Payment>(dto);
            await _repository.AddAsync(payment);

            return CreatedAtAction(nameof(GetById), new { id = payment.Id_Pagamento }, dto);
        }

        // PUT: api/payment/{id}
        // Atualiza um pagamento existente
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, CreatePaymentDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return NotFound();

            _mapper.Map(dto, existing);
            await _repository.UpdateAsync(existing);

            return NoContent(); // 204 - Atualização bem-sucedida
        }

        // DELETE: api/payment/{id}
        // Remove um pagamento pelo ID
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

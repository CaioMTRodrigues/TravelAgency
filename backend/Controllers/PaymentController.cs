﻿// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 19/07/2025
// 📁 Arquivo: PaymentController
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Controller responsável por gerenciar pagamentos
// -----------------------------------------------------------------------------

using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Exceptions;
using WebApplication1.Repositories;

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
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetAll()
        {
            var payments = await _repository.GetAllAsync();
            var result = _mapper.Map<IEnumerable<PaymentDto>>(payments);
            return Ok(result);
        }

        // GET: api/payment/{id}
        // Retorna um pagamento específico pelo ID
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin, User")]
        public async Task<ActionResult<PaymentDto>> GetById(int id)
        {
            var payment = await _repository.GetByIdAsync(id);
            if (payment == null)
                throw new NotFoundException("Pagamento", id);

            var dto = _mapper.Map<PaymentDto>(payment);
            return Ok(dto);
        }

        // POST: api/payment
        // Cria um novo pagamento
        [HttpPost]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> Create(CreatePaymentDto dto)
        {
            var payment = _mapper.Map<Payment>(dto);
            await _repository.AddAsync(payment);

            return CreatedAtAction(nameof(GetById), new { id = payment.Id_Pagamento }, dto);
        }

        // PUT: api/payment/{id}
        // Atualiza um pagamento existente
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Update(int id, CreatePaymentDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("Pagamento", id);

            _mapper.Map(dto, existing);
            await _repository.UpdateAsync(existing);

            return NoContent(); // 204 - Atualização bem-sucedida
        }

        // DELETE: api/payment/{id}
        // Remove um pagamento pelo ID
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(int id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("Pagamento", id);

            await _repository.DeleteAsync(id);
            return NoContent(); // 204 - Exclusão bem-sucedida
        }
    }
}

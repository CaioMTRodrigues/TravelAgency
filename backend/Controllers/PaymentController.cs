using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Exceptions;
using WebApplication1.Repositories;
using WebApplication1.Services; // Importa o PaymentService e ReservationService

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Define a rota como: api/payment
    public class PaymentController : ControllerBase
    {
        private readonly IRepository<Payment, int> _repository;
        private readonly IMapper _mapper;
        private readonly PaymentService _paymentService;
        private readonly ReservationService _reservationService;

        // Construtor com injeção de dependência do repositório, do AutoMapper e dos novos serviços
        public PaymentController(
            IRepository<Payment, int> repository,
            IMapper mapper,
            PaymentService paymentService,
            ReservationService reservationService)
        {
            _repository = repository;
            _mapper = mapper;
            _paymentService = paymentService;
            _reservationService = reservationService;
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
        // Cria um novo pagamento (endpoint existente para criação manual/administrativa)
        [HttpPost]
        [Authorize(Roles = "User")] // Pode ser ajustado para Admin se a criação for apenas interna
        public async Task<ActionResult> Create(CreatePaymentDto dto)
        {
            var payment = _mapper.Map<Payment>(dto);
            await _repository.AddAsync(payment);

            return CreatedAtAction(nameof(GetById), new { id = payment.Id_Pagamento }, dto);
        }

        // NOVO ENDPOINT: POST: api/payment/create-payment-intent
        // Cria uma intenção de pagamento no Stripe e retorna o client_secret para o front-end
        [HttpPost("create-payment-intent")]
        // MODIFICAÇÃO AQUI: Permite tanto a role "User" quanto "Admin"
        [Authorize(Roles = "User, Admin")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentRequestDto paymentRequest)
        {
            try
            {
                // 1. Validar e buscar a reserva
                var reservation = await _reservationService.ObterPorIdAsync(paymentRequest.ReservationId);
                if (reservation == null)
                {
                    throw new NotFoundException("Reserva", paymentRequest.ReservationId);
                }

                // 2. Criar o PaymentIntent no Stripe
                var paymentIntent = await _paymentService.CreatePaymentIntentAsync(reservation.ValorPacote, paymentRequest.Currency);

                // 3. Registrar o pagamento no seu banco de dados
                var newPayment = new Payment
                {
                    Id_Reserva = reservation.Id_Reserva,
                    Valor = reservation.ValorPacote,
                    Data_Pagamento = DateTime.UtcNow,
                    Status = StatusPagamento.Pendente,
                    Tipo = TipoPagamento.Cartao_Credito,
                    StripePaymentIntentId = paymentIntent.Id
                };

                await _repository.AddAsync(newPayment);

                // 4. Retorna o client_secret e o ID do pagamento recém-criado
                return Ok(new { clientSecret = paymentIntent.ClientSecret, paymentId = newPayment.Id_Pagamento });
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (StripeException e)
            {
                return BadRequest(new { error = e.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Ocorreu um erro interno ao processar o pagamento.", details = ex.Message });
            }
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
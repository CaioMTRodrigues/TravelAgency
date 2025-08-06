using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Exceptions;
using WebApplication1.Repositories;
using WebApplication1.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IRepository<Payment, int> _repository;
        private readonly IMapper _mapper;
        private readonly PayPalService _payPalService;
        private readonly ReservationService _reservationService;

        public PaymentController(
            IRepository<Payment, int> repository,
            IMapper mapper,
            PayPalService payPalService,
            ReservationService reservationService)
        {
            _repository = repository;
            _mapper = mapper;
            _payPalService = payPalService;
            _reservationService = reservationService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetAll()
        {
            var payments = await _repository.GetAllAsync();
            var result = _mapper.Map<IEnumerable<PaymentDto>>(payments);
            return Ok(result);
        }

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

        [HttpPost("create-paypal-order")]
        [Authorize(Roles = "User, Admin")]
        public async Task<IActionResult> CreatePayPalOrder([FromBody] PaymentRequestDto paymentRequest)
        {
            try
            {
                var reservation = await _reservationService.ObterPorIdAsync(paymentRequest.ReservationId);
                if (reservation == null)
                {
                    throw new NotFoundException("Reserva", paymentRequest.ReservationId);
                }

                var payPalOrderResponse = await _payPalService.CreateOrderAsync(reservation.ValorPacote, paymentRequest.Currency);

                var newPayment = new Payment
                {
                    Id_Reserva = reservation.Id_Reserva,
                    Valor = reservation.ValorPacote,
                    Data_Pagamento = DateTime.UtcNow,
                    Status = StatusPagamento.Pendente,
                    Tipo = TipoPagamento.PayPal,
                    PayPalOrderId = payPalOrderResponse.OrderId
                };

                await _repository.AddAsync(newPayment);

                return Ok(new { orderId = payPalOrderResponse.OrderId });
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Ocorreu um erro interno ao criar a ordem de pagamento.", details = ex.Message });
            }
        }

        [HttpPost("capture-paypal-order")]
        [Authorize(Roles = "User, Admin")]
        public async Task<IActionResult> CapturePayPalOrder([FromBody] CaptureOrderRequestDto captureRequest)
        {
            try
            {
                bool isSuccess = await _payPalService.CaptureOrderAsync(captureRequest.OrderId);

                if (isSuccess)
                {
                    // Usamos o método específico do nosso repositório para buscar o pagamento
                    var payment = await ((PaymentRepository)_repository).GetByPayPalOrderIdAsync(captureRequest.OrderId);
                    if (payment == null)
                    {
                        throw new NotFoundException("Pagamento", captureRequest.OrderId);
                    }

                    payment.Status = StatusPagamento.Aprovado;
                    payment.Data_Pagamento = DateTime.UtcNow;
                    await _repository.UpdateAsync(payment);

                    return Ok(new { status = "Pagamento aprovado com sucesso." });
                }
                else
                {
                    // Se a captura falhar na API do PayPal, atualizamos nosso status para Falhou
                    var payment = await ((PaymentRepository)_repository).GetByPayPalOrderIdAsync(captureRequest.OrderId);
                    if (payment != null)
                    {
                        payment.Status = StatusPagamento.Falhou;
                        await _repository.UpdateAsync(payment);
                    }
                    return BadRequest(new { error = "Não foi possível capturar o pagamento." });
                }
            }
            catch (NotFoundException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Ocorreu um erro interno ao capturar o pagamento.", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Update(int id, CreatePaymentDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("Pagamento", id);

            _mapper.Map(dto, existing);
            await _repository.UpdateAsync(existing);

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(int id)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                throw new NotFoundException("Pagamento", id);

            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }

    // DTO auxiliar para o corpo da requisição de captura
    public class CaptureOrderRequestDto
    {
        public string OrderId { get; set; }
    }
}
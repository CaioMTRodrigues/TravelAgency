using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Exceptions;
using WebApplication1.Repositories;
using WebApplication1.Services;

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

        /*
        [HttpPost("create-checkout-session")]
        public async Task<IActionResult> CreateCheckoutSession([FromBody] PaymentRequestDto request)
        {
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
        {
            new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    UnitAmount = (long)(request.Amount * 100), // valor em centavos
                    Currency = "brl",
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = request.PackageName,
                    },
                },
                Quantity = 1,
            },
        },
                Mode = "payment",
                SuccessUrl = "https://seusite.com/sucesso",
                CancelUrl = "https://seusite.com/cancelado",
            };

            var service = new SessionService();
            Session session = await service.CreateAsync(options);

            return Ok(new { sessionId = session.Id });
        }*/



        [HttpPost("create-paypal-order")]
        [Authorize(Roles = "Admin, User")]
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
        [Authorize(Roles = "Admin, USer")]
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

        /*      NOVOS ENDPOINTS           */

        [HttpPost("create-stripe-order")]
        [Authorize(Roles = "Admin, User")]
        public async Task<IActionResult> CreateStripeOrder([FromBody] CreatePaymentDto dto)
        {
            try
            {
                var reservation = await _reservationService.ObterPorIdAsync(dto.Id_Reserva);
                if (reservation == null)
                    throw new NotFoundException("Reserva", dto.Id_Reserva);

                var payment = new Payment
                {
                    Id_Reserva = dto.Id_Reserva,
                    Valor = dto.Valor,
                    Data_Pagamento = dto.Data_Pagamento,
                    Status = StatusPagamento.Pendente,
                    Tipo = dto.Tipo,
                    StripePaymentIntentId = Guid.NewGuid().ToString() // Simulação
                };

                await _repository.AddAsync(payment);

                return Ok(new { paymentIntentId = payment.StripePaymentIntentId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erro ao criar pagamento simulado.", details = ex.Message });
            }
        }

        [HttpPost("capture-stripe-order")]
        [Authorize(Roles = "Admin, User")]
        public async Task<IActionResult> CaptureStripeOrder([FromBody] StripeCaptureDto dto)
        {
            var payment = await ((PaymentRepository)_repository).GetByStripePaymentIntentIdAsync(dto.PaymentIntentId);
            if (payment == null)
                return NotFound(new { error = "Pagamento não encontrado." });

            payment.Status = StatusPagamento.Aprovado;
            payment.Data_Pagamento = DateTime.UtcNow;
            await _repository.UpdateAsync(payment);

            return Ok(new { status = "Pagamento simulado como aprovado." });
        }

        public class StripeCaptureDto
        {
            public string PaymentIntentId { get; set; }
        }

        [HttpGet("formas")]
        [AllowAnonymous] // ou [Authorize] se quiser restringir
        public ActionResult<IEnumerable<object>> GetFormasPagamento()
        {
            var formas = Enum.GetValues(typeof(TipoPagamento))
                .Cast<TipoPagamento>()
                .Select(tp => new
                {
                    tipo = tp.ToString(),
                    label = tp switch
                    {
                        TipoPagamento.Cartao_Credito => "Cartão de Crédito",
                        TipoPagamento.Boleto => "Boleto Bancário",
                        TipoPagamento.Transferencia_Bancaria => "Transferência Bancária",
                        //TipoPagamento.PayPal => "PayPal",
                        _ => tp.ToString()
                    }
                });

            return Ok(formas);
        }



    }

    // DTO auxiliar para o corpo da requisição de captura
    public class CaptureOrderRequestDto
    {
        public string OrderId { get; set; }
    }

    


}
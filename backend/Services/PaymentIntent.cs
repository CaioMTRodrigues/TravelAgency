using Stripe;
using Microsoft.Extensions.Configuration;

public class PaymentService
{
    private readonly Stripe.PaymentIntentService _paymentIntentService;

    public PaymentService(IConfiguration configuration)
    {
        StripeConfiguration.ApiKey = configuration["Stripe:SecretKey"];
        _paymentIntentService = new Stripe.PaymentIntentService();
    }

    public async Task<PaymentIntent> CreatePaymentIntentAsync(decimal amount, string currency)
    {
        var options = new PaymentIntentCreateOptions
        {
            Amount = (long)(amount * 100), 
            Currency = currency,
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
            {
                Enabled = true,
            },
        };
        return await _paymentIntentService.CreateAsync(options);
    }
}
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Globalization;

namespace WebApplication1.Services
{
    // DTO para a resposta do token de acesso do PayPal
    public class PayPalAccessTokenResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; }
    }

    // DTO para a resposta da criação de ordem do PayPal
    public class PayPalOrderResponse
    {
        [JsonPropertyName("id")]
        public string OrderId { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }
    }

    // DTO para a resposta da captura de uma ordem do PayPal
    public class PayPalCaptureResponse
    {
        [JsonPropertyName("status")]
        public string Status { get; set; }
    }


    public class PayPalService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly string _clientId;
        private readonly string _clientSecret;
        private readonly string _baseUrl;

        public PayPalService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
            _clientId = _config["PayPal:ClientId"];
            _clientSecret = _config["PayPal:ClientSecret"];
            // Use o ambiente de sandbox para testes. Mude para o URL de produção quando estiver pronto.
            _baseUrl = "https://api.sandbox.paypal.com";
        }

        /// <summary>
        /// Obtém um token de acesso da API do PayPal.
        /// </summary>
        private async Task<string> GetAccessTokenAsync()
        {
            var request = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/v1/oauth2/token");

            var auth = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_clientId}:{_clientSecret}"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", auth);

            request.Content = new StringContent("grant_type=client_credentials", Encoding.UTF8, "application/x-www-form-urlencoded");

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonSerializer.Deserialize<PayPalAccessTokenResponse>(content);

            return tokenResponse.AccessToken;
        }

        /// <summary>
        /// Cria uma ordem de pagamento no PayPal.
        /// </summary>
        public async Task<PayPalOrderResponse> CreateOrderAsync(decimal amount, string currency)
        {
            var accessToken = await GetAccessTokenAsync();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var orderRequest = new
            {
                intent = "CAPTURE",
                purchase_units = new List<object>
                {
                    new
                    {
                        amount = new
                        {
                            currency_code = currency,
                            // Formata o valor para o padrão do PayPal (ex: "100.00")
                            value = amount.ToString("F2", CultureInfo.InvariantCulture)
                        }
                    }
                }
            };

            var jsonRequest = JsonSerializer.Serialize(orderRequest);
            var requestContent = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync($"{_baseUrl}/v2/checkout/orders", requestContent);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var orderResponse = JsonSerializer.Deserialize<PayPalOrderResponse>(content);

            return orderResponse;
        }

        /// <summary>
        /// Captura (finaliza) um pagamento de uma ordem do PayPal.
        /// </summary>
        public async Task<bool> CaptureOrderAsync(string orderId)
        {
            var accessToken = await GetAccessTokenAsync();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var requestContent = new StringContent("", Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync($"{_baseUrl}/v2/checkout/orders/{orderId}/capture", requestContent);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var captureResponse = JsonSerializer.Deserialize<PayPalCaptureResponse>(content);

            // Retorna true se o status da captura for "COMPLETED"
            return captureResponse.Status == "COMPLETED";
        }
    }
}
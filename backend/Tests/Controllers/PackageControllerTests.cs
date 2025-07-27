using ikvm.runtime;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Net;
using System.Net.Http.Json;
using WebApplication1;
using WebApplication1.Data;
using WebApplication1.DTOs;
using Xunit;

namespace WebApplication1.backend.Tests.Controllers
{
    public class PackageControllerTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly HttpClient _client;

        public PackageControllerTests(WebApplicationFactory<Startup> factory)
        {
            // Configura o WebApplicationFactory para usar banco de dados em memória
            _client = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    // Remove o contexto real
                    var descriptor = services.SingleOrDefault(
                        d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));
                    if (descriptor != null)
                        services.Remove(descriptor);

                    // Adiciona o contexto em memória
                    services.AddDbContext<ApplicationDbContext>(options =>
                    {
                        options.UseInMemoryDatabase("TestDb");
                    });
                });
            }).CreateClient();
        }

        // Testa o endpoint GET: /api/package
        [Fact]
        public async Task GetAll_ReturnsOk()
        {
            var response = await _client.GetAsync("/api/package");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // Testa o endpoint POST: /api/package
        [Fact]
        public async Task Create_ReturnsCreated()
        {
            var novoPacote = new CreatePackageDto
            {
                Titulo = "Pacote Teste",
                Descricao = "Descrição Teste",
                Destino = "Recife",
                DuracaoDias = 5,
                DataInicio = DateTime.Today,
                DataFim = DateTime.Today.AddDays(5),
                Valor = 999.99m,
                ImagemUrl = "https://exemplo.com/imagem.jpg"
            };

            var response = await _client.PostAsJsonAsync("/api/package", novoPacote);
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        // Testa o endpoint GET: /api/package/{id}
        [Fact]
        public async Task GetById_ReturnsOk_WhenPackageExists()
        {
            var novoPacote = new CreatePackageDto
            {
                Titulo = "Pacote Teste",
                Descricao = "Descrição Teste",
                Destino = "Natal",
                DuracaoDias = 7,
                DataInicio = DateTime.Today,
                DataFim = DateTime.Today.AddDays(7),
                Valor = 1200.00m,
                ImagemUrl = "https://exemplo.com/natal.jpg"
            };

            var postResponse = await _client.PostAsJsonAsync("/api/package", novoPacote);
            var location = postResponse.Headers.Location.ToString();
            var getResponse = await _client.GetAsync(location);

            Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);
        }

        // Testa o endpoint PUT: /api/package/{id}
        [Fact]
        public async Task Update_ReturnsNoContent_WhenPackageExists()
        {
            var pacoteOriginal = new CreatePackageDto
            {
                Titulo = "Pacote Original",
                Descricao = "Descrição Original",
                Destino = "Fortaleza",
                DuracaoDias = 4,
                DataInicio = DateTime.Today,
                DataFim = DateTime.Today.AddDays(4),
                Valor = 800.00m,
                ImagemUrl = "https://exemplo.com/fortaleza.jpg"
            };

            var postResponse = await _client.PostAsJsonAsync("/api/package", pacoteOriginal);
            var location = postResponse.Headers.Location.ToString();
            var id = int.Parse(location.Split('/').Last());

            var pacoteAtualizado = new CreatePackageDto
            {
                Titulo = "Pacote Atualizado",
                Descricao = "Descrição Atualizada",
                Destino = "Fortaleza",
                DuracaoDias = 6,
                DataInicio = DateTime.Today,
                DataFim = DateTime.Today.AddDays(6),
                Valor = 950.00m,
                ImagemUrl = "https://exemplo.com/fortaleza2.jpg"
            };

            var putResponse = await _client.PutAsJsonAsync($"/api/package/{id}", pacoteAtualizado);
            Assert.Equal(HttpStatusCode.NoContent, putResponse.StatusCode);
        }

        // Testa o endpoint DELETE: /api/package/{id}
        [Fact]
        public async Task Delete_ReturnsNoContent_WhenPackageExists()
        {
            var pacote = new CreatePackageDto
            {
                Titulo = "Pacote Para Deletar",
                Descricao = "Será deletado",
                Destino = "Salvador",
                DuracaoDias = 3,
                DataInicio = DateTime.Today,
                DataFim = DateTime.Today.AddDays(3),
                Valor = 600.00m,
                ImagemUrl = "https://exemplo.com/salvador.jpg"
            };

            var postResponse = await _client.PostAsJsonAsync("/api/package", pacote);
            var location = postResponse.Headers.Location.ToString();
            var id = int.Parse(location.Split('/').Last());

            var deleteResponse = await _client.DeleteAsync($"/api/package/{id}");
            Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
        }
    }
}

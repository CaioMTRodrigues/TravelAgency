using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using WebApplication1.Data;
using WebApplication1.Entities;
using WebApplication1.Repositories;
using WebApplication1.Profiles; // Importa o perfil do AutoMapper

var builder = WebApplication.CreateBuilder(args);

// 🔗 String de conexão com o banco de dados
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// 🧩 Registro dos repositórios
builder.Services.AddScoped<IRepository<Package, int>, PackageRepository>();
builder.Services.AddScoped<IRepository<Evaluation, int>, EvaluationRepository>();
builder.Services.AddScoped<IRepository<Reservation, int>, ReservationRepository>();
builder.Services.AddScoped<IRepository<Payment, int>, PaymentRepository>();

// 🔄 Registro do AutoMapper com o perfil correto
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// ✅ Configurações dos controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Serializa enums como strings no JSON
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    })
    .AddFluentValidation(fv =>
    {
        // Registra validadores do FluentValidation
        fv.RegisterValidatorsFromAssemblyContaining<Program>();
    });

// 🔍 Swagger para documentação da API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔐 Serviços adicionais (ex: autenticação)
builder.Services.AddScoped<AuthService>();

var app = builder.Build();

// 🌐 Configuração do pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();

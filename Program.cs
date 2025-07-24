using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using WebApplication1.Data;
using WebApplication1.Entities;
using WebApplication1.Exceptions;
using WebApplication1.Filters;
using WebApplication1.Profiles;
using WebApplication1.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 🔗 Conexão com o banco de dados
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// 🧩 Repositórios
builder.Services.AddScoped<IRepository<Package, int>, PackageRepository>();
builder.Services.AddScoped<IRepository<Evaluation, int>, EvaluationRepository>();
builder.Services.AddScoped<IRepository<Reservation, int>, ReservationRepository>();
builder.Services.AddScoped<IRepository<Payment, int>, PaymentRepository>();
builder.Services.AddScoped<IRepository<Traveler, int>, TravelerRepository>();
builder.Services.AddScoped<ReservationTravelerRepository>();

// 🔄 AutoMapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// 📘 Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 🔐 Serviços
builder.Services.AddScoped<AuthService>();

// 🌍 CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// ✅ Autorização
builder.Services.AddAuthorization();

// ✅ Controllers com filtro de validação global
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilter>(); // ⬅️ Filtro de validação
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});


//Desativando 
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});


var app = builder.Build();

// 🌐 Pipeline
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ⚠️ Middleware de exceções
app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();

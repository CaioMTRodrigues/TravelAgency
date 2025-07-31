using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Projeto.TravelAgency.Services;
using WebApplication1.backend.Data;
using WebApplication1.Data;
using WebApplication1.Entities;
using WebApplication1.Filters;
using WebApplication1.Profiles;
using WebApplication1.Repositories;
using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);

// 🔗 Conexão com o banco de dados
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions =>
        sqlOptions.EnableRetryOnFailure())); // Habilita resiliência a falhas

// 🧩 Repositórios
builder.Services.AddScoped<IRepository<Package, int>, PackageRepository>();
builder.Services.AddScoped<IRepository<Evaluation, int>, EvaluationRepository>();
builder.Services.AddScoped<IRepository<Reservation, int>, ReservationRepository>();
builder.Services.AddScoped<IRepository<Payment, int>, PaymentRepository>();
builder.Services.AddScoped<IRepository<Traveler, int>, TravelerRepository>();
builder.Services.AddScoped<ReservationTravelerRepository>();

// 🔄 AutoMapper
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// 📘 Swagger para documentação da API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ Serviços da aplicação
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ReservationService>();
builder.Services.AddScoped<PackageService>();

// 🔐 Configuração do Identity
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// ✅ Configuração de requisitos de senha do Identity
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
});

// 🔐 Serviço de geração de token JWT
builder.Services.AddScoped<JwtService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var userManager = provider.GetRequiredService<UserManager<User>>();
    var secretKey = configuration["Jwt:Key"];
    return new JwtService(secretKey, userManager);
});

// 🌍 CORS - Permite requisições de qualquer origem
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
    options.Filters.Add<ValidationFilter>();
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// ❌ Desativa a validação automática do ModelState
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

var app = builder.Build();

// 🌱 Seed de dados iniciais
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        var userManager = services.GetRequiredService<UserManager<User>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        await SeedData.Initialize(context, userManager, roleManager);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao popular o DB com as Roles: {ex.Message}");
        if (ex.InnerException != null)
            Console.WriteLine($"Detalhe interno: {ex.InnerException.Message}");
    }
}

// 🌐 Pipeline de requisições
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ⚠️ Middleware de tratamento global de exceções
app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();

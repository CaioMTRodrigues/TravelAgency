using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Projeto.TravelAgency.Services;
using System.Text;
using System.Text.Json.Serialization;
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
        sqlOptions.EnableRetryOnFailure()));

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

// ✅ Serviços da aplicação
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ReservationService>();
builder.Services.AddScoped<PackageService>();

// 🔐 Identity
builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// ✅ Requisitos de senha
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
});

// 🔐 JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// JWT Service
builder.Services.AddScoped<JwtService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var userManager = provider.GetRequiredService<UserManager<User>>();
    var secretKey = configuration["Jwt:Key"];
    return new JwtService(secretKey, userManager);
});

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

// ✅ Controllers com filtro de validação
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilter>();
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// ❌ Desativa validação automática do ModelState
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

var app = builder.Build();

// 🌐 Pipeline de requisições
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication(); // ✅ Importante: antes do Authorization
app.UseAuthorization();

app.MapControllers();
app.Run();

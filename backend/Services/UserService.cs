using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Services;

public class UserService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly EmailService _emailService;
    private readonly ILogger<UserService> _logger;

    public UserService(ApplicationDbContext context, IConfiguration configuration, EmailService emailService, ILogger<UserService> logger)
    {
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<bool> RegisterUserAsync(CreateUserDTO userDto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
            return false;

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

        var token = Guid.NewGuid().ToString();
        var expiracao = DateTime.UtcNow.AddHours(24);

        var user = new User
        {
            // Do NOT set Id here
            Name = userDto.Name,
            Email = userDto.Email,
            PasswordHash = passwordHash,
            PhoneNumber = userDto.PhoneNumber,
            Document = userDto.Document,
            Role = "Cliente",
            EmailConfirmed = false,
            EmailConfirmationToken = token,
            TokenExpiration = expiracao
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var encodedToken = WebUtility.UrlEncode(token);
        var confirmationLink = $"{_configuration["AppSettings:FrontendUrl"]}/confirmar-email?email={user.Email}&token={encodedToken}";

        await _emailService.EnviarEmailConfirmacaoAsync(user.Email, token);

        return true;
    }

    public async Task<string> LoginAsync(UserLoginDTO loginDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            return null;

        if (!user.EmailConfirmed)
            return null;

        return GenerateJwtToken(user);
    }

    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("role", user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(8),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public async Task<bool> ConfirmarEmailAsync(string email, string token)
    {
        _logger.LogInformation($"Tentando confirmar e-mail: {email} com token: {token}");

        var user = await _context.Users.FirstOrDefaultAsync(u =>
            u.Email == email && u.EmailConfirmationToken == token);

        if (user == null)
        {
            _logger.LogWarning("Usuário não encontrado ou token inválido.");
            return false;
        }

        if (user.TokenExpiration < DateTime.UtcNow)
        {
            _logger.LogWarning("Token expirado.");
            return false;
        }

        user.EmailConfirmed = true;
        user.EmailConfirmationToken = null;
        user.TokenExpiration = null;

        await _context.SaveChangesAsync();
        _logger.LogInformation("E-mail confirmado com sucesso.");
        return true;
    }
}
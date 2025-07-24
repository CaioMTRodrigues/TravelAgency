using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Services;

public class AuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly EmailService _emailService;

    // Construtor com injeção de dependências
    public AuthService(ApplicationDbContext context, IConfiguration configuration, EmailService emailService)
    {
        _context = context;
        _configuration = configuration;
        _emailService = emailService;
    }

    // Registra um novo usuário e envia e-mail de confirmação
    public async Task<bool> RegisterUserAsync(CreateUserDTO userDto)
    {
        // Verifica se o e-mail já está cadastrado
        if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
            return false;

        // Gera o hash da senha usando BCrypt
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

        // Gera token de confirmação de e-mail e define validade
        var token = Guid.NewGuid().ToString();
        var expiracao = DateTime.UtcNow.AddHours(24);

        // Cria o objeto User com os dados e token
        var user = new User
        {
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

        // Salva o usuário no banco
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Envia o e-mail de confirmação
        await _emailService.EnviarEmailConfirmacaoAsync(user.Email, token);

        return true;
    }

    // Realiza login e retorna token JWT se o e-mail estiver confirmado
    public async Task<string> LoginAsync(UserLoginDTO loginDto)
    {
        // Busca o usuário pelo e-mail
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        // Verifica se o usuário existe e se a senha está correta
        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            return null;

        // Impede login se o e-mail ainda não foi confirmado
        if (!user.EmailConfirmed)
            return null;

        // Gera e retorna o token JWT
        var token = GenerateJwtToken(user);
        return token;
    }

    // Gera o token JWT com claims do usuário
    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id_User.ToString()),
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

    // Confirma o e-mail do usuário com base no token
    public async Task<bool> ConfirmarEmailAsync(string email, string token)
    {
        Console.WriteLine($"[DEBUG] Tentando confirmar e-mail: {email} com token: {token}");

        var user = await _context.Users.FirstOrDefaultAsync(u =>
            u.Email == email && u.EmailConfirmationToken == token);

        if (user == null)
        {
            Console.WriteLine("[DEBUG] Usuário não encontrado ou token inválido.");
            return false;
        }

        if (user.TokenExpiration < DateTime.UtcNow)
        {
            Console.WriteLine("[DEBUG] Token expirado.");
            return false;
        }

        user.EmailConfirmed = true;
        user.EmailConfirmationToken = null;
        user.TokenExpiration = null;

        await _context.SaveChangesAsync();
        Console.WriteLine("[DEBUG] E-mail confirmado com sucesso.");
        return true;
    }

}

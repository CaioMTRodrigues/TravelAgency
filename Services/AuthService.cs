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

public class AuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<bool> RegisterUserAsync(CreateUserDTO userDto)
    {
        // 1. Lógica de Validação: Verifica se o e-mail já existe
        if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
        {
            
            return false;
        }

        // 2. Lógica de Geração de Hash de Senha (bcrypt)
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

        // 3. Mapeia o DTO para a Entidade
        var user = new User
        {
            Name = userDto.Name,
            Email = userDto.Email,
            PasswordHash = passwordHash,
            PhoneNumber = userDto.PhoneNumber,
            Document = userDto.Document,
            Role = "Cliente" 
        };

        // 4. Persiste os dados do usuário no banco de dados
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // 5. Preparar lógica para envio de e-mail (mockado)
        
        Console.WriteLine($"Mock: E-mail de confirmação enviado para {user.Email}");

        return true;
    }

    public async Task<string> LoginAsync(UserLoginDTO loginDto)
    {
        // 1. Lógica de Validação de Credenciais
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        // Verifica se o usuário existe e se a senha está correta
        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return null; 
        }

        // 2. Gerar e retornar token JWT
        var token = GenerateJwtToken(user);
        return token;
    }

    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

        // Claims são as "informações" 
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()), // Sujeito do token, geralmente o ID do usuário
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("role", user.Role), // Claim customizada para o perfil do usuário
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // ID único para o token
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(8), // Tempo de expiração do token
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
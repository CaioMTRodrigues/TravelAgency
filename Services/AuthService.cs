using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.DTOs;
using WebApplication1.Entities;

public class AuthService
{
    private readonly ApplicationDbContext _context;

    public AuthService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> RegisterUserAsync(UserRegisterDTO userDto)
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
}
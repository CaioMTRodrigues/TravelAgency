using Microsoft.AspNetCore.Identity;
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
using WebApplication1.DTOs;
using WebApplication1.Entities;
using WebApplication1.Services;

public class UserService
{
    private readonly UserManager<User> _userManager;
    private readonly IConfiguration _configuration;
    private readonly EmailService _emailService;
    private readonly ILogger<UserService> _logger;

    public UserService(
        UserManager<User> userManager,
        IConfiguration configuration,
        EmailService emailService,
        ILogger<UserService> logger)
    {
        _userManager = userManager;
        _configuration = configuration;
        _emailService = emailService;
        _logger = logger;
    }

    public async Task<bool> RegisterUserAsync(CreateUserDTO userDto)
    {
        if (await _userManager.FindByEmailAsync(userDto.Email) != null)
            return false;

        var token = Guid.NewGuid().ToString();
        var expiracao = DateTime.UtcNow.AddHours(24);

        var user = new User
        {
            Name = userDto.Name,
            Email = userDto.Email,
            UserName = userDto.Email,
            NormalizedEmail = userDto.Email.ToLower(), // salva em minúsculo
            NormalizedUserName = userDto.Email.ToLower(), // opcional
            PhoneNumber = userDto.PhoneNumber,
            Document = userDto.Document,
            Role = "User",
            EmailConfirmed = false,
            EmailConfirmationToken = token,
            TokenExpiration = expiracao
        };

        var result = await _userManager.CreateAsync(user, userDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                _logger.LogError($"Erro ao criar usuário: {error.Description}");
            }
            return false;
        }

        await _userManager.AddToRoleAsync(user, "User");

        var encodedToken = WebUtility.UrlEncode(token);
        var confirmationLink = $"{_configuration["AppSettings:FrontendUrl"]}/confirmar-email?email={user.Email}&token={encodedToken}";

        await _emailService.EnviarEmailConfirmacaoAsync(user.Email, token);

        return true;
    }

    public async Task<string> LoginAsync(UserLoginDTO loginDto)
    {
        var normalizedEmail = loginDto.Email.ToLower(); // busca em minúsculo
        var user = await _userManager.Users
            .FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail);

        if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password))
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

        var normalizedEmail = email.ToLower();
        var user = await _userManager.Users
            .FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail);

        if (user == null || user.EmailConfirmationToken != token)
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

        await _userManager.UpdateAsync(user);
        _logger.LogInformation("E-mail confirmado com sucesso.");
        return true;
    }

    public async Task<bool> ForgotPasswordAsync(string email)
    {
        var normalizedEmail = email.ToLower();
        var user = await _userManager.Users
            .FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail);

        if (user == null)
            return true;

        user.PasswordResetToken = Guid.NewGuid().ToString();
        user.PasswordResetTokenExpiration = DateTime.UtcNow.AddHours(1);

        await _userManager.UpdateAsync(user);

        var encodedToken = WebUtility.UrlEncode(user.PasswordResetToken);
        var resetLink = $"{_configuration["AppSettings:FrontendUrl"]}/redefinir-senha?token={encodedToken}";

        await _emailService.EnviarEmailRecuperacaoSenhaAsync(user.Email, resetLink);

        return true;
    }

    public async Task<bool> ResetPasswordAsync(string token, string newPassword)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u =>
            u.PasswordResetToken == token &&
            u.PasswordResetTokenExpiration > DateTime.UtcNow);

        if (user == null)
            return false;

        var result = await _userManager.RemovePasswordAsync(user);
        if (!result.Succeeded)
            return false;

        result = await _userManager.AddPasswordAsync(user, newPassword);
        if (!result.Succeeded)
            return false;

        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiration = null;

        await _userManager.UpdateAsync(user);
        return true;
    }
}

// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 28/07/2025
// 📁 Arquivo: JwtService.cs
// 📦 Projeto: TravelAgency
// 🔐 Descrição: Serviço responsável por gerar tokens JWT para autenticação de usuários
// -----------------------------------------------------------------------------

using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApplication1.Entities;

namespace Projeto.TravelAgency.Services
{
    public class JwtService
    {
        private readonly string _secretKey;
        private readonly UserManager<User> _userManager;

        // Construtor recebe a chave secreta e o gerenciador de usuários do Identity
        public JwtService(string secretKey, UserManager<User> userManager)
        {
            _secretKey = secretKey;
            _userManager = userManager;
        }

        // Gera um token JWT contendo os dados e papéis do usuário
        public async Task<string> GenerateToken(User usuario)
        {
            // Converte a chave secreta em bytes
            var key = Encoding.ASCII.GetBytes(_secretKey);

            // Obtém os papéis (roles) do usuário
            var roles = await _userManager.GetRolesAsync(usuario);

            // Define os claims básicos do token
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Name, usuario.Name)
            };

            // Adiciona os papéis como claims
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // Define os parâmetros do token, incluindo validade e assinatura
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1), // Token válido por 1 dia
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
            };

            // Cria e retorna o token JWT
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
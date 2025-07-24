using Microsoft.AspNetCore.Mvc;
using WebApplication1.DTOs;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    // POST: api/auth/register
    // Registra um novo usuário
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateUserDTO userDto)
    {
        // A validação do modelo é feita automaticamente pelo ValidationFilter

        var success = await _authService.RegisterUserAsync(userDto);

        if (!success)
            return Conflict(new { message = "Este e-mail já está em uso." });

        return CreatedAtAction(nameof(Register), new { email = userDto.Email }, new { message = "Usuário registrado com sucesso." });
    }

    // POST: api/auth/login
    // Realiza login e retorna token JWT
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] UserLoginDTO loginDto)
    {
        var token = await _authService.LoginAsync(loginDto);

        if (string.IsNullOrEmpty(token))
            return Unauthorized(new { message = "E-mail ou senha inválidos." });

        return Ok(new { token });
    }
}

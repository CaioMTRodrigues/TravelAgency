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

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserRegisterDTO userDto)
    {
        
        var success = await _authService.RegisterUserAsync(userDto);

        if (!success)
        {
            return Conflict(new { message = "Este e-mail já está em uso." });
        }

        return CreatedAtAction(nameof(Register), new { email = userDto.Email }, new { message = "Usuário registrado com sucesso." });
    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.backend.DTOs;
using WebApplication1.DTOs;
using WebApplication1.Services;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    [Authorize(Roles = "Admin, User")]
    public async Task<IActionResult> Register([FromBody] CreateUserDTO userDto)
    {
        var success = await _userService.RegisterUserAsync(userDto);

        if (!success)
            return Conflict(new { message = "Este e-mail já está em uso." });

        return CreatedAtAction(nameof(Register), new { email = userDto.Email }, new { message = "Usuário registrado com sucesso." });
    }

    [HttpPost("login")]
    [Authorize(Roles = "Admin, User")]
    public async Task<IActionResult> Login([FromBody] UserLoginDTO loginDto)
    {
        var token = await _userService.LoginAsync(loginDto);

        if (string.IsNullOrEmpty(token))
            return Unauthorized(new { message = "E-mail ou senha inválidos." });

        return Ok(new { token });
    }

    [HttpGet("confirmar-email")]
    [Authorize(Roles = "Admin, User")]
    public async Task<IActionResult> ConfirmarEmail([FromQuery] string email, [FromQuery] string token)
    {
        var sucesso = await _userService.ConfirmarEmailAsync(email, token);

        if (!sucesso)
            return BadRequest(new { message = "Token inválido ou expirado." });

        return Ok(new { message = "✅ E-mail confirmado com sucesso! Agora você pode fazer login." });
    }

    [HttpPost("forgot-password")]
    [Authorize(Roles = "Admin, User")]
    public async Task<IActionResult> ForgotPassword([FromBody] PasswordRecoveryRequestDto dto)
    {
        await _userService.ForgotPasswordAsync(dto.Email);
        // Sempre retorna sucesso, mesmo se o e-mail não existir
        return Ok(new { message = "Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha." });
    }

    [HttpPost("reset-password")]
    [Authorize(Roles = "Admin, User")]
    public async Task<IActionResult> ResetPassword([FromBody] PasswordResetDto dto)
    {
        var result = await _userService.ResetPasswordAsync(dto.Token, dto.NewPassword);
        if (!result)
            return BadRequest(new { message = "Token inválido ou expirado." });

        return Ok(new { message = "Senha redefinida com sucesso." });
    }
}

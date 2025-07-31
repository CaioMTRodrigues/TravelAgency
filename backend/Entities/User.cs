using Microsoft.AspNetCore.Identity;

public class User : IdentityUser
{
    public string Name { get; set; }
    public string Document { get; set; }
    public string Role { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string? EmailConfirmationToken { get; set; }
    public DateTime? TokenExpiration { get; set; }
    public string? PasswordResetToken { get; set; }
    public DateTime? PasswordResetTokenExpiration { get; set; }
}

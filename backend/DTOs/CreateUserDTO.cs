using System.ComponentModel.DataAnnotations;

public class CreateUserDTO
{
    [Required]
    public string Name { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    [CpfOuPassaporte]
    public string Document { get; set; }

    [Required]
    public string PhoneNumber { get; set; }

    [Required]
    public string Password { get; set; }

    [Required]
    [Compare("Password")]
    public string ConfirmPassword { get; set; }
}

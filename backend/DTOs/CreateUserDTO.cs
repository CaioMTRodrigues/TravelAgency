using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DTOs
{
    public class CreateUserDTO
    {
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "O nome deve ter entre 2 e 100 caracteres.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "O e-mail deve ser válido.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "A senha é obrigatória.")]
        [MinLength(8, ErrorMessage = "A senha deve ter pelo menos 8 caracteres.")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$", ErrorMessage = "A senha deve conter letra maiúscula, minúscula e número.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "O número de telefone é obrigatório.")]
        [RegularExpression(@"^\+?[1-9]\d{1,14}$", ErrorMessage = "O número de telefone deve ser válido.")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "O documento é obrigatório.")]
        [RegularExpression(@"^\d{11}$", ErrorMessage = "O documento deve conter exatamente 11 dígitos.")]
        public string Document { get; set; }
    }
}

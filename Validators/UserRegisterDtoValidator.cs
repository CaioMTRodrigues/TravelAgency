using FluentValidation;
using WebApplication1.DTOs;

namespace WebApplication1.Validators
{
    public class UserRegisterDtoValidator : AbstractValidator<CreateUserDTO>
    {
        public UserRegisterDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("O nome é obrigatório.")
                .Length(2, 100).WithMessage("O nome deve ter entre 2 e 100 caracteres.");
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("O e-mail é obrigatório.")
                .EmailAddress().WithMessage("O e-mail deve ser válido.");
            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("A senha é obrigatória.")
                .MinimumLength(8).WithMessage("A senha deve ter pelo menos 8 caracteres.")
                .Matches("[A-Z]").WithMessage("A senha deve conter ao menos uma letra maiúscula.")
                .Matches("[a-z]").WithMessage("A senha deve conter ao menos uma letra minúscula.")
                .Matches("[0-9]").WithMessage("A senha deve conter ao menos um número.");
            RuleFor(x => x.PhoneNumber)
                .NotEmpty().WithMessage("O número de telefone é obrigatório.")
                .Matches(@"^\+?[1-9]\d{1,14}$").WithMessage("O número de telefone deve ser válido.");
            RuleFor(x => x.Document)
                .NotEmpty().WithMessage("O documento é obrigatório.")
                .Matches(@"^\d{11}$").WithMessage("O documento deve conter exatamente 11 dígitos.");
        }
    }
}
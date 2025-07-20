// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 20/07/2025
// 📁 Arquivo: CreateTravelerDto
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Pega a Entidade TravelerDto e converte em Traveler e Validações
// -----------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations;

namespace WebApplication1.backend.DTOs
{
    public class CreateTravelerDto

    {
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [StringLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres.")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "O e-mail deve ser válido.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "O telefone é obrigatório.")]
        [Phone(ErrorMessage = "O telefone deve ser válido.")]
        public string Telefone { get; set; }

        [Required(ErrorMessage = "A data de nascimento é obrigatória.")]
        public DateTime DataNascimento { get; set; }

        [StringLength(200, ErrorMessage = "O endereço deve ter no máximo 200 caracteres.")]
        public string? Endereco { get; set; }
    }
}

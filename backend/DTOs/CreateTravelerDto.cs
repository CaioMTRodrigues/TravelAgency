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

        [Required(ErrorMessage = "O documento é obrigatório.")]
        //[CpfOuPassaporte]
        public string Documento { get; set; }

        [Required(ErrorMessage = "A data de nascimento é obrigatória.")]
        public DateTime Data_Nascimento { get; set; }

        [Required(ErrorMessage = "O ID do usuário é obrigatório.")]
        public string Id_Usuario { get; set; }
    }
}

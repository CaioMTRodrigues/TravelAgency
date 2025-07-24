// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 18/07/2025
// 📁 Arquivo: CreateEvaluationDto
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Pega os dados da avaliação e converte em entidade Evaluation com validações
// -----------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DTOs
{
    public class CreateEvaluationDto

    {
        [Required(ErrorMessage = "A nota é obrigatória.")]
        [Range(0, 5, ErrorMessage = "A nota deve estar entre 0 e 5.")]
        public double Nota { get; set; }
        [Required(ErrorMessage = "O comentàrio é obirgatório.")]
        [StringLength(1000, ErrorMessage = "O comentário deve ter no máximo 1000 caracteres.")]
        public string? Comentario { get; set; }

        [Required(ErrorMessage = "A data da avaliação é obrigatória.")]
        public DateTime Data { get; set; }

        [Required(ErrorMessage = "O ID do usuário é obrigatório.")]
        public int Id_Usuario { get; set; }

        [Required(ErrorMessage = "O ID do pacote é obrigatório.")]
        public int Id_Pacote { get; set; }
    }
}

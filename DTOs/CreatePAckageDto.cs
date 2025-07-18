using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DTOs
{
    public class CreatePAckageDto

    {
        [Required(ErrorMessage = "O título é obrigatório.")]
        [StringLength(100, ErrorMessage = "O título deve ter no máximo 100 caracteres.")]
        public string Titulo { get; set; }

        [Required(ErrorMessage = "A descrição é obrigatória.")]
        [StringLength(500, ErrorMessage = "A descrição deve ter no máximo 500 caracteres.")]
        public string Descricao { get; set; }

        [Required(ErrorMessage = "O destino é obrigatório.")]
        [StringLength(100, ErrorMessage = "O destino deve ter no máximo 100 caracteres.")]
        public string Destino { get; set; }

        [Required(ErrorMessage = "A duração é obrigatória.")]
        [Range(1, int.MaxValue, ErrorMessage = "A duração deve ser maior que zero.")]
        public int DuracaoDias { get; set; }

        [Required(ErrorMessage = "A data de início é obrigatória.")]
        public DateTime DataInicio { get; set; }

        [Required(ErrorMessage = "A data de fim é obrigatória.")]
        public DateTime DataFim { get; set; }

        [Required(ErrorMessage = "O valor é obrigatório.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero.")]
        public decimal Valor { get; set; }

        [Url(ErrorMessage = "A URL da imagem deve ser válida.")]
        public string? ImagemUrl { get; set; }
    }

}

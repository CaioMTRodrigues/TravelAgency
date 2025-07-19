// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 18/07/2025
// 📁 Arquivo: EvaluationDto
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Representa os dados de uma avaliação para exibição
// -----------------------------------------------------------------------------

namespace WebApplication1.DTOs
{
    public class EvaluationDto
    {

        public int Id_Avaliacao { get; set; }
        public double Nota { get; set; }
        public string? Comentario { get; set; }
        public DateTime Data { get; set; }
        public int IdUsuario { get; set; }
        public int IdPacote { get; set; }

    }
}

// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 18/07/2025
// 📁 Arquivo: Evaluation
// 📦 Projeto: TravelAgency
// 🚀  Descrição: Entidade AVALIACAO, atributos e relacionamentos
// -----------------------------------------------------------------------------

namespace WebApplication1.Entities
{
    public class Evaluation
    {
        public int Id_Evaluation { get; set; }
        public double Nota { get; set; }
        public string Comentario { get; set; }
        public DateTime Data { get; set; }

        // Chaves estrangeiras
        public int IdUsuario { get; set; }
        public int IdPacote { get; set; }

    }
}

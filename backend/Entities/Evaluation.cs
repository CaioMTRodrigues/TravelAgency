// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 18/07/2025
// 📁 Arquivo: Evaluation
// 📦 Projeto: TravelAgency
// 🚀  Descrição: Entidade AVALIACAO, atributos e relacionamentos
// -----------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Entities
{
    public class Evaluation
    {
        [Key]
        public int Id_Avaliacao { get; set; }
        public double Nota { get; set; }
        public string Comentario { get; set; }
        public DateTime Data { get; set; }

        // Chaves estrangeiras
        public string Id_Usuario { get; set; }
        public int Id_Pacote { get; set; }


        // Propriedades de navegação

        [ForeignKey("Id_Usuario")]
        public User Usuario { get; set; }

        [ForeignKey("Id_Pacote")]
        public Package Pacote { get; set; }



    }
}

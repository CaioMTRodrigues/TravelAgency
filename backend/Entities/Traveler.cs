// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 20/07/2025
// 📁 Arquivo: Viajante
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Entidade VIAJANTE e relacionamento com USUÁRIO e RESERVAS
// -----------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Entities
{
    public class Traveler
    {
        [Key]
        public int Id_Viajante { get; set; }
        
        public string Nome { get; set; }
        public string Documento { get; set; }
        public DateTime Data_Nascimento { get; set; }

        // Chave estrangeira para o usuário responsável
        public int Id_Usuario { get; set; }

        [ForeignKey("Id_Usuario")]
        public User Usuario { get; set; }

        // Relacionamento com a tabela de associação ReservaViajante
        //public ICollection<ReservaViajante> ReservaViajantes { get; set; }
    }
}

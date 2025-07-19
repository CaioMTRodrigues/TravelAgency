// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 17/07/2025
// 📁 Arquivo: Package
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Classe Package e seus atributos
// -----------------------------------------------------------------------------

namespace WebApplication1.Entities
{
    public class Package
    {
        public int Id_Package { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public string Destino { get; set; }
        public int DuracaoDias { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public decimal Valor { get; set; }
        public string ImagemUrl { get; set; }

        
             public ICollection<Reservation> Reservas { get; set; }
             public ICollection<Evaluation> Avaliacoes { get; set; }
        
    }

}

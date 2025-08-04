// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 20/07/2025
// 📁 Arquivo: TravelerDto
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Pega a Entidade Traveler e converte em TravelerDto
// -----------------------------------------------------------------------------

namespace WebApplication1.backend.DTOs
{
    public class TravelerDto
    {

        public int Id_Viajante { get; set; }
        public string Nome { get; set; }
        public string Documento { get; set; }
        public DateTime Data_Nascimento { get; set; }
        public string Id_Usuario { get; set; }



    }
}

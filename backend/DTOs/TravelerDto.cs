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
        public int Id_Traveler { get; set; }

        public string Nome { get; set; }

        public string Email { get; set; }

        public string Telefone { get; set; }

        public DateTime DataNascimento { get; set; }

        public string? Endereco { get; set; }
    }
}

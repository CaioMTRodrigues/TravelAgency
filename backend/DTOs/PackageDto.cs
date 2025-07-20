// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 17/07/2025
// 📁 Arquivo: PackageDto
// 📦 Projeto: TravelAgency
// 🚀  Descrição: Pega a Entidade Package e converte em PackageDto
// -----------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DTOs
{
    public class PackageDto

    {
        public int Id_Pacote { get; set; }

        public string Titulo { get; set; }

        public string Descricao { get; set; }
       
        public string Destino { get; set; }

        public int DuracaoDias { get; set; }

        public DateTime DataInicio { get; set; }

        public DateTime DataFim { get; set; }

        public decimal Valor { get; set; }

        public string? ImagemUrl { get; set; }
    }
}

// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 17/07/2025
// 📁 Arquivo: AutoMapperProfile
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Classe Responsável por Conversão Entidade p DTO, vice-versa
// -----------------------------------------------------------------------------

using AutoMapper; // Biblioteca para mapeamento automático entre objetos
using WebApplication1.DTOs; // Contém os DTOs usados para entrada/saída na API
using WebApplication1.Entities; // Contém as entidades do domínio (modelo de dados)

namespace WebApplication1.Profiles
{
    // Perfil de configuração do AutoMapper
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // Mapeia de entidade para DTO (resposta da API)
            CreateMap<Package, PackageDto>();

            // Mapeia de DTO para entidade (entrada da API)
            CreateMap<CreatePackageDto, Package>();

            // Mapeia de entidade para DTO (resposta da API)
            CreateMap<Evaluation, EvaluationDto>();

            // Mapeia de DTO para entidade (entrada da API)
            CreateMap<CreateEvaluationDto, Evaluation>();
        }
    }
}

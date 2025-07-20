// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 17/07/2025
// 📁 Arquivo: AutoMapperProfile
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Classe Responsável por Conversão Entidade p DTO, vice-versa
// -----------------------------------------------------------------------------

using AutoMapper; // Biblioteca para mapeamento automático entre objetos
using WebApplication1.backend.DTOs;
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

            // Mapeia Reservation para DTO
            CreateMap<Reservation, ReservationDto>();

            // Mapeia DTO para Reservation
            CreateMap<CreateReservationDto, Reservation>()
                .ForMember(dest => dest.Id_Usuario, opt => opt.MapFrom(src => src.Id_Usuario))
                .ForMember(dest => dest.Id_Pacote, opt => opt.MapFrom(src => src.Id_Pacote));


            // Mapeia Payment para DTO
            CreateMap<Payment, PaymentDto>();

            // Mapeia DTO para Payment
            CreateMap<CreatePaymentDto, Payment>();

            // Mapeia Traveler para DTO       
            CreateMap<Traveler, TravelerDto>();

            // Mapeia DTO para Traveler
            CreateMap<CreateTravelerDto, Traveler>();


        }
    }
}

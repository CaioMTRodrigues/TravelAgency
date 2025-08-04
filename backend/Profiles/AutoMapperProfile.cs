// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 17/07/2025
// 📁 Arquivo: AutoMapperProfile
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Classe Responsável por Conversão Entidade p DTO, vice-versa
// -----------------------------------------------------------------------------

using AutoMapper; // Biblioteca para mapeamento automático entre objetos
using WebApplication1.backend.DTOs;
using WebApplication1.backend.Entities;
using WebApplication1.DTOs; // Contém os DTOs usados para entrada/saída na API
using WebApplication1.Entities; // Contém as entidades do domínio (modelo de dados)

namespace WebApplication1.Profiles
{
    // Perfil de configuração do AutoMapper
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            #region Package
            CreateMap<Package, PackageDto>();
            CreateMap<CreatePackageDto, Package>();
            #endregion

            #region Evaluation
            CreateMap<Evaluation, EvaluationDto>();
            CreateMap<CreateEvaluationDto, Evaluation>();
            #endregion

            #region Reservation
            CreateMap<Reservation, ReservationDto>();
            CreateMap<CreateReservationDto, Reservation>()
                .ForMember(dest => dest.Id_Usuario, opt => opt.MapFrom(src => src.Id_Usuario))
                .ForMember(dest => dest.Id_Pacote, opt => opt.MapFrom(src => src.Id_Pacote));
            #endregion

            #region Payment    
            CreateMap<Payment, PaymentDto>();
            CreateMap<CreatePaymentDto, Payment>();
            #endregion

            #region Traveler
            CreateMap<CreateTravelerDto, Traveler>();
            CreateMap<Traveler, TravelerDto>();
            #endregion

            #region ReservationTraveler
            CreateMap<ReservationTraveler, ReservationTravelerDto>();

            CreateMap<CreateReservationTravelerDto, ReservationTraveler>()
                .ForMember(dest => dest.Reserva, opt => opt.Ignore())
                .ForMember(dest => dest.Viajante, opt => opt.Ignore());

            #endregion


        }
    }
}

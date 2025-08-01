﻿// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Data de Criação: 20/07/2025
// 📁 Arquivo: ReservationTraveler
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Entidade de junção entre Reserva e Viajante (N:N)
// -----------------------------------------------------------------------------

using System.ComponentModel.DataAnnotations.Schema;
using WebApplication1.Entities;

namespace WebApplication1.backend.Entities
{
    public class ReservationTraveler
    {
        public int Id_Reserva { get; set; }
        [ForeignKey("Id_Reserva")]
        public Reservation Reserva { get; set; }

        public int Id_Viajante { get; set; }
        [ForeignKey("Id_Viajante")]
        public Traveler Viajante { get; set; }

    }
}

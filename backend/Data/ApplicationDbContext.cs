// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 17/07/2025
// 📁 Arquivo: ApplicationDbContext
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Classe de contexto do Entity Framework para acesso ao banco de dados
// -----------------------------------------------------------------------------

using Microsoft.EntityFrameworkCore;
using WebApplication1.backend.Entities;
using WebApplication1.Entities;

namespace WebApplication1.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Tabelas do banco de dados
        public DbSet<User> Users { get; set; }
        public DbSet<Package> Packages { get; set; }
        public DbSet<Evaluation> Evaluations { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Traveler> Travelers { get; set; }
        public DbSet<ReservationTraveler> ReservaViajantes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relacionamento Reservation -> User (muitos para um)
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Usuario)
                .WithMany()
                .HasForeignKey(r => r.Id_Usuario)
                .HasConstraintName("FK_Reservations_Users_Id_Usuario");

            // Relacionamento Reservation -> Package (muitos para um)
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Pacote)
                .WithMany(p => p.Reservas)
                .HasForeignKey(r => r.Id_Pacote)
                .HasConstraintName("FK_Reservations_Packages_Id_Pacote");

            // Relacionamento Evaluation -> User (muitos para um)
            modelBuilder.Entity<Evaluation>()
                .HasOne(e => e.Usuario)
                .WithMany()
                .HasForeignKey(e => e.Id_Usuario)
                .HasConstraintName("FK_Evaluations_Users_Id_Usuario");

            // Relacionamento Evaluation -> Package (muitos para um)
            modelBuilder.Entity<Evaluation>()
                .HasOne(e => e.Pacote)
                .WithMany(p => p.Avaliacoes)
                .HasForeignKey(e => e.Id_Pacote)
                .HasConstraintName("FK_Evaluations_Packages_Id_Pacote");

            // Relacionamento Payment -> Reservation (um para um)
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Pagamento)
                .WithOne(p => p.Reserva)
                .HasForeignKey<Payment>(p => p.Id_Reserva)
                .HasConstraintName("FK_Payments_Reservations_Id_Reserva");

            // Relacionamento Traveler -> User (muitos viajantes para um usuário)
            modelBuilder.Entity<Traveler>()
                .HasOne(t => t.Usuario)
                .WithMany()
                .HasForeignKey(t => t.Id_Usuario)
                .HasConstraintName("FK_Travelers_Users_Id_Usuario");

            
            // Relacionamento Traveler -> ReservaViajante (um para muitos)
            modelBuilder.Entity<Traveler>()
                .HasMany(t => t.ReservaViajantes)
                .WithOne(rv => rv.Viajante)
                .HasForeignKey(rv => rv.Id_Viajante)
                .HasConstraintName("FK_ReservaViajante_Traveler_Id_Viajante");

            // Reservation -> ReservaViajante
            modelBuilder.Entity<Reservation>()
                .HasMany(r => r.ReservaViajantes)
                .WithOne(rv => rv.Reserva)
                .HasForeignKey(rv => rv.Id_Reserva)
                .HasConstraintName("FK_ReservaViajante_Reservation_Id_Reserva");

            // Chave composta para a tabela de junção
            modelBuilder.Entity<ReservationTraveler>()
                .HasKey(rv => new { rv.Id_Reserva, rv.Id_Viajante });

        }
    }
}

// -----------------------------------------------------------------------------
// 🧠 Autor: Ericson Sérgio Costa Soares
// 📅 Criado em: 17/07/2025
// 📁 Arquivo: ApplicationDbContext
// 📦 Projeto: TravelAgency
// 🚀 Descrição: Classe de contexto do Entity Framework para acesso ao banco de dados
// -----------------------------------------------------------------------------

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebApplication1.backend.Entities;
using WebApplication1.Entities;

namespace WebApplication1.Data
{
    // Herda de IdentityDbContext para integrar o Identity com o EF Core
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        // DbSets representam as tabelas no banco de dados
       //public DbSet<User> Users { get; set; }
        public DbSet<Package> Packages { get; set; }
        public DbSet<Evaluation> Evaluations { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Traveler> Travelers { get; set; }
        public DbSet<ReservationTraveler> ReservationTravelers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().ToTable("Users");

            // Renomeia as tabelas padrão do Identity para nomes personalizados
            modelBuilder.Entity<IdentityRole>().ToTable("Roles");
            modelBuilder.Entity<IdentityUserRole<string>>().ToTable("UsuariosRoles");
            modelBuilder.Entity<IdentityUserClaim<string>>().ToTable("UsuarioClaims");
            modelBuilder.Entity<IdentityUserLogin<string>>().ToTable("UsuariosLogins");
            modelBuilder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaims");
            modelBuilder.Entity<IdentityUserToken<string>>().ToTable("UsuarioTokens");

            // Salva o enum Status como string no banco
            modelBuilder.Entity<Reservation>()
                .Property(r => r.Status)
                .HasConversion<string>();

            // Garante que o campo Document (CPF ou Passaporte) seja único
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Document)
                .IsUnique();

            // Relacionamento: Reservation -> User (muitos para um)
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Usuario)
                .WithMany()
                .HasForeignKey(r => r.Id_Usuario)
                .HasConstraintName("FK_Reservations_Users_Id_Usuario");

            // Relacionamento: Reservation -> Package (muitos para um)
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Pacote)
                .WithMany(p => p.Reservas)
                .HasForeignKey(r => r.Id_Pacote)
                .HasConstraintName("FK_Reservations_Packages_Id_Pacote");

            // Relacionamento: Evaluation -> User (muitos para um)
            modelBuilder.Entity<Evaluation>()
                .HasOne(e => e.Usuario)
                .WithMany()
                .HasForeignKey(e => e.Id_Usuario)
                .HasConstraintName("FK_Evaluations_Users_Id_Usuario");

            // Relacionamento: Evaluation -> Package (muitos para um)
            modelBuilder.Entity<Evaluation>()
                .HasOne(e => e.Pacote)
                .WithMany(p => p.Avaliacoes)
                .HasForeignKey(e => e.Id_Pacote)
                .HasConstraintName("FK_Evaluations_Packages_Id_Pacote");

            // Relacionamento: Reservation -> Payments (um para muitos)
            modelBuilder.Entity<Reservation>()
                .HasMany(r => r.Pagamentos)
                .WithOne(p => p.Reserva)
                .HasForeignKey(p => p.Id_Reserva)
                .HasConstraintName("FK_Payments_Reservations_Id_Reserva");

            // Relacionamento: Traveler -> User (muitos para um)
            modelBuilder.Entity<Traveler>()
                .HasOne(t => t.Usuario)
                .WithMany()
                .HasForeignKey(t => t.Id_Usuario)
                .HasConstraintName("FK_Travelers_Users_Id_Usuario")
                .OnDelete(DeleteBehavior.NoAction);

            // Relacionamento: Traveler -> ReservationTraveler (um para muitos)
            modelBuilder.Entity<Traveler>()
                .HasMany(t => t.ReservaViajantes)
                .WithOne(rv => rv.Viajante)
                .HasForeignKey(rv => rv.Id_Viajante)
                .HasConstraintName("FK_ReservaViajante_Traveler_Id_Viajante")
                .OnDelete(DeleteBehavior.NoAction);

            // Relacionamento: Reservation -> ReservationTraveler (um para muitos)
            modelBuilder.Entity<Reservation>()
                .HasMany(r => r.ReservaViajantes)
                .WithOne(rv => rv.Reserva)
                .HasForeignKey(rv => rv.Id_Reserva)
                .HasConstraintName("FK_ReservaViajante_Reservation_Id_Reserva")
                .OnDelete(DeleteBehavior.NoAction);

            // Chave composta para a tabela de junção ReservationTraveler
            modelBuilder.Entity<ReservationTraveler>()
                .HasKey(rv => new { rv.Id_Reserva, rv.Id_Viajante });
        }
    }
}

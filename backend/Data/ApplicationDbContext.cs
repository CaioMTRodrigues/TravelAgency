using Microsoft.EntityFrameworkCore;
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
        }
    }
}

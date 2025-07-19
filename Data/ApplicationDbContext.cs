
using Microsoft.EntityFrameworkCore;
using WebApplication1.Entities;

namespace WebApplication1.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        //Criação da tabela PACKAGE
        public DbSet<Package> Packages { get; set; }
        public DbSet<Evaluation> Evaluations { get; set; }

        public DbSet<Reservation> Reservations { get; set; }


        // Criação da tabela PAYMENT
        public DbSet<Payment> Payments { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relacionamento Reservation -> User
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Usuario)
                .WithMany()
                .HasForeignKey(r => r.Id_Usuario)
                .HasConstraintName("FK_Reservations_Users_Id_Usuario");

            // Relacionamento Reservation -> Package
            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Pacote)
                .WithMany(p => p.Reservas)
                .HasForeignKey(r => r.Id_Pacote)
                .HasConstraintName("FK_Reservations_Packages_Id_Pacote");

            // Relacionaemnto Evaluation -> User
            modelBuilder.Entity<Evaluation>()
                .HasOne(e => e.Usuario)
                .WithMany()
                .HasForeignKey(e => e.Id_Usuario)
                .HasConstraintName("FK_Evaluations_Users_Id_Usuario");


            // Relacionamento Evaluation -> Package
            modelBuilder.Entity<Evaluation>()
                .HasOne(e => e.Pacote)
                .WithMany(p => p.Avaliacoes)
                .HasForeignKey(e => e.Id_Pacote)
                .HasConstraintName("FK_Evaluations_Packages_Id_Pacote");


            // Relacionamento Payment -> Reservation
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Reserva)
                .WithMany()
                .HasForeignKey(p => p.Id_Reserva)
                .HasConstraintName("FK_Payments_Reservations_Id_Reserva");



        }
    }
}

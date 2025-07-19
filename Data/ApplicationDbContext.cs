
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
                .WithMany()
                .HasForeignKey(r => r.Id_Pacote)
                .HasConstraintName("FK_Reservations_Packages_Id_Pacote");
        }
    }
}

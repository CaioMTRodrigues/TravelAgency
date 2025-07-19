
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
    }
}

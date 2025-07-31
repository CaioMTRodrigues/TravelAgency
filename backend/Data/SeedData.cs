using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;

namespace WebApplication1.backend.Data
{
    public static class SeedData
    {
        public static async Task Initialize(
            ApplicationDbContext context,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager
        )
        {
            // Aplica as migrations pendentes ao banco de dados
            await context.Database.MigrateAsync();

            // Cria a role "Admin" se ela ainda não existir
            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }

            // Cria a role "User" se ela ainda não existir
            if (!await roleManager.RoleExistsAsync("User"))
            {
                await roleManager.CreateAsync(new IdentityRole("User"));
            }

            // Verifica se o usuário admin já existe
            var adminUser = await userManager.FindByEmailAsync("admin@travelagency.com");

            if (adminUser == null)
            {
                // Cria o usuário admin com nome e sobrenome
                adminUser = new User
                {
                    Name = "Administrador",
                    Email = "admin@travelagency.com",

                };

            }
            await context.SaveChangesAsync();
        }
        
    }
}
        

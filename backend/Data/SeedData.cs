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
                adminUser = new User
                {
                    Name = "Administrador",
                    Email = "admin@travelagency.com",
                    UserName = "admin@travelagency.com",
                    Document = "00000000000",
                    PasswordHash = "SenhaSegura123!", // A senha será definida posteriormente
                    Role = "Admin"

                };

                try
                {
                    var result = await userManager.CreateAsync(adminUser, "SenhaSegura123!");

                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(adminUser, "Admin");
                        Console.WriteLine("Usuário admin criado e atribuído à role Admin.");
                    }
                    else
                    {
                        Console.WriteLine("Erro ao criar usuário admin:");
                        foreach (var error in result.Errors)
                        {
                            Console.WriteLine($"- {error.Description}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Erro ao popular o DB com as Roles: {ex.Message}");
                    if (ex.InnerException != null)
                        Console.WriteLine($"Detalhe interno: {ex.InnerException.Message}");
                }
            }

        }
    }
}




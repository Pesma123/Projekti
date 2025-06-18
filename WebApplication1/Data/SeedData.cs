using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using WebApplication1.Models;

namespace WebApplication1.Data
{
    public static class SeedData
    {
        public static async Task Initialize(
            IServiceProvider serviceProvider,
            UserManager<Korisnik> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            // 1) Definiraj sve potrebne uloge
            var roleNames = new[] { "Student", "Profesor", "Dekan" };
            foreach (var roleName in roleNames)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                    await roleManager.CreateAsync(new IdentityRole(roleName));
            }

            // 2) Default korisnici
            var defaultUsers = new[]
            {
                new { Email = "student1@example.com",  Role = "Student",  Password = "Password123!" },
                new { Email = "profesor1@example.com", Role = "Profesor", Password = "Password123!" },
                new { Email = "dekan1@example.com",    Role = "Dekan",     Password = "Password123!" },
                new { Email = "dekan@mail.com",        Role = "Dekan",     Password = "dekan" }
            };

            foreach (var info in defaultUsers)
            {
                // Ako korisnik ne postoji, kreiraj ga
                if (await userManager.FindByEmailAsync(info.Email) == null)
                {
                    // Rastavi email lokalni dio za Ime/Prezime
                    var local = info.Email.Split('@')[0];
                    var parts = local.Split(new[] { '.', '_' }, StringSplitOptions.RemoveEmptyEntries);
                    var ime = parts.Length > 0 ? parts[0] : local;
                    var prezime = parts.Length > 1 ? parts[1] : parts[0];

                    var user = new Korisnik
                    {
                        UserName = info.Email,
                        Email = info.Email,
                        EmailConfirmed = true,
                        Ime = char.ToUpper(ime[0]) + ime.Substring(1),
                        Prezime = char.ToUpper(prezime[0]) + prezime.Substring(1),
                        uloga = Enum.Parse<Uloga>(info.Role)
                    };

                    var result = await userManager.CreateAsync(user, info.Password);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(user, info.Role);
                    }
                    else
                    {
                        // Po potrebi: logiraj result.Errors
                    }
                }
            }
        }
    }
}

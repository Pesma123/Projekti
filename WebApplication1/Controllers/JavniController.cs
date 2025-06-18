using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using System.Linq;
using System.Security.Claims;

namespace WebApplication1.Controllers
{
    public class JavniController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<Korisnik> _userManager;

        public JavniController(ApplicationDbContext context, UserManager<Korisnik> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [AllowAnonymous] // Dozvoli svima da vide formu
        public IActionResult UnosKoda()
        {
            return View();
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> PrikazUspijeha()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Challenge(); // Nije autentificiran

            var ocjene = await _context.KorisnikPredmet
                .Include(kp => kp.Predmet)
                .Where(kp => kp.KorisnikId == user.Id)
                .Select(kp => new PredmetOcjenaModel
                {
                    PredmetID = kp.PredmetID,
                    ImePredmeta = kp.Predmet.ImePredmeta,
                    Ocjena = kp.Ocjena
                })
                .ToListAsync();

            var model = new StudentPredmetiModel
            {
                StudentId = user.Id,
                ImePrezime = $"{user.Ime} {user.Prezime}",
                Predmeti = ocjene
            };

            return View(model);
        }

    }
}

using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    // Omogućavamo i profesorima i dekanu da uđu u kontroller,
    // dok specifične akcije Create/Delete ostaju rezervirane za Dekana
    [Authorize(Roles = "Profesor,Dekan")]
    public class ProfesorController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<Korisnik> _userManager;

        public ProfesorController(
            UserManager<Korisnik> userManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        // GET: Profesor/Index — svi mogu pogledati
        [AllowAnonymous]
        public IActionResult Index()
        {
            var profesori = _context.Users
                .Where(u => u.uloga == Uloga.Profesor)
                .ToList();

            return View("~/Views/Profesori/Index.cshtml", profesori);
        }

        // GET: Profesor/MojiPredmeti — samo Profesor
        [Authorize(Roles = "Profesor")]
        public async Task<IActionResult> MojiPredmeti()
        {
            var userId = _userManager.GetUserId(User);

            var predmeti = await _context.KorisnikPredmet
                .Where(kp => kp.KorisnikId == userId)
                .Select(kp => kp.Predmet)
                .ToListAsync();

            var sviIspiti = await _context.Ispit.ToListAsync();
            var sveReg = await _context.RegistracijeIspita
                .Include(r => r.Korisnik)
                .ToListAsync();

            var model = predmeti.Select(p => new PredmetIspitiRegistracijaViewModel
            {
                PredmetID = p.PredmetID,
                ImePredmeta = p.ImePredmeta,
                BrojECTS = p.BrojECTS,
                Ispiti = sviIspiti
                    .Where(i => i.PredmetID == p.PredmetID)
                    .OrderBy(i => i.Datum)
                    .Select(i => new IspitRegistracijaModel
                    {
                        IspitId = i.IspitId,
                        Datum = i.Datum,
                        PrijavljeniStudenti = sveReg
                            .Where(r => r.IspitId == i.IspitId)
                            .Select(r => r.Korisnik)
                            .ToList()
                    })
                    .ToList()
            }).ToList();

            return View("~/Views/Profesori/MojiPredmeti.cshtml", model);
        }

        // GET: Profesor/DodajIspit
        [Authorize(Roles = "Profesor")]
        public async Task<IActionResult> DodajIspit(int predmetId)
        {
            var predmet = await _context.Predmet.FindAsync(predmetId);
            if (predmet == null) return NotFound();

            var vm = new DodajIspitViewModel
            {
                PredmetId = predmet.PredmetID,
                ImePredmeta = predmet.ImePredmeta,
                Datum = DateTime.Now
            };
            return View("~/Views/Profesori/DodajIspit.cshtml", vm);
        }

        // POST: Profesor/DodajIspit
        [HttpPost, ValidateAntiForgeryToken]
        [Authorize(Roles = "Profesor")]
        public async Task<IActionResult> DodajIspit(DodajIspitViewModel model)
        {
            if (!ModelState.IsValid)
                return View("~/Views/Profesori/DodajIspit.cshtml", model);

            _context.Ispit.Add(new Ispit
            {
                PredmetID = model.PredmetId,
                Datum = model.Datum
            });
            await _context.SaveChangesAsync();

            return RedirectToAction(nameof(MojiPredmeti));
        }

        // GET: Profesor/Details/5
        [AllowAnonymous]
        public async Task<IActionResult> Details(string id)
        {
            if (string.IsNullOrEmpty(id)) return NotFound();

            var profesor = await _context.Users
                .Include(u => u.KorisnikPredmet)
                    .ThenInclude(kp => kp.Predmet)
                .FirstOrDefaultAsync(u => u.Id == id && u.uloga == Uloga.Profesor);

            if (profesor == null) return NotFound();
            return View("~/Views/Profesori/Details.cshtml", profesor);
        }

        // GET: Profesor/Create — samo Dekan
        [Authorize(Roles = "Dekan")]
        public IActionResult Create()
        {
            var vm = new ProfesorCreateModel
            {
                Predmeti = _context.Predmet
                    .Select(p => new SelectListItem
                    {
                        Value = p.PredmetID.ToString(),
                        Text = p.ImePredmeta
                    })
                    .ToList()
            };
            return View("~/Views/Profesori/Create.cshtml", vm);
        }

        // POST: Profesor/Create — samo Dekan
        [HttpPost, ValidateAntiForgeryToken]
        [Authorize(Roles = "Dekan")]
        public async Task<IActionResult> Create(ProfesorCreateModel model)
        {
            if (!ModelState.IsValid)
            {
                model.Predmeti = _context.Predmet
                    .Select(p => new SelectListItem
                    {
                        Value = p.PredmetID.ToString(),
                        Text = p.ImePredmeta
                    })
                    .ToList();
                return View("~/Views/Profesori/Create.cshtml", model);
            }

            var noviProfesor = new Korisnik
            {
                UserName = model.Email,
                Email = model.Email,
                Ime = model.Ime,
                Prezime = model.Prezime,
                EmailConfirmed = true,
                uloga = Uloga.Profesor
            };

            var result = await _userManager.CreateAsync(noviProfesor, "profesor");
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(noviProfesor, "Profesor"); // Ispravka role string?
                _context.KorisnikPredmet.Add(new KorisnikPredmet
                {
                    KorisnikId = noviProfesor.Id,
                    PredmetID = int.Parse(model.Predmet)
                });
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            foreach (var error in result.Errors)
                ModelState.AddModelError(string.Empty, error.Description);

            model.Predmeti = _context.Predmet
                .Select(p => new SelectListItem
                {
                    Value = p.PredmetID.ToString(),
                    Text = p.ImePredmeta
                }).ToList();
            return View("~/Views/Profesori/Create.cshtml", model);
        }

        // GET: Profesor/Delete/5 — samo Dekan
        [Authorize(Roles = "Dekan")]
        public async Task<IActionResult> Delete(string id)
        {
            if (string.IsNullOrEmpty(id)) return NotFound();

            var profesor = await _userManager.Users
                .FirstOrDefaultAsync(u => u.Id == id && u.uloga == Uloga.Profesor);

            if (profesor == null) return NotFound();
            return View("~/Views/Profesori/Delete.cshtml", profesor);
        }

        // POST: Profesor/Delete/5 — samo Dekan
        [HttpPost, ActionName("Delete"), ValidateAntiForgeryToken]
        [Authorize(Roles = "Dekan")]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            if (string.IsNullOrEmpty(id)) return NotFound();

            var profesor = await _userManager.FindByIdAsync(id);
            if (profesor == null) return NotFound();

            var result = await _userManager.DeleteAsync(profesor);
            if (result.Succeeded)
                return RedirectToAction(nameof(Index));

            ModelState.AddModelError(string.Empty, "Brisanje nije uspjelo.");
            return View("~/Views/Profesori/Delete.cshtml", profesor);
        }

        // GET: Profesor/UpisiStudentaNaPredmet/5 — samo Profesor
        [Authorize(Roles = "Profesor")]
        public async Task<IActionResult> UpisiStudentaNaPredmet(int predmetId)
        {
            var studenti = await _userManager.GetUsersInRoleAsync("Student");
            ViewBag.PredmetId = predmetId;
            return View("~/Views/Profesori/UpisiStudentaNaPredmet.cshtml", studenti);
        }

        // POST: Profesor/UpisiStudentaNaPredmet — samo Profesor
        [HttpPost, ValidateAntiForgeryToken]
        [Authorize(Roles = "Profesor")]
        public async Task<IActionResult> UpisiStudentaNaPredmet(string studentId, int predmetId)
        {
            _context.KorisnikPredmet.Add(new KorisnikPredmet
            {
                KorisnikId = studentId,
                PredmetID = predmetId
            });
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(UpisiStudentaNaPredmet), new { predmetId });
        }

        //ZAVRSIISPIT
        [HttpPost]
        [Authorize(Roles = "Profesor")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ZavrsiIspit(int ispitId)
        {
            var ispit = await _context.Ispit.FindAsync(ispitId);

            if (ispit == null)
                return NotFound();

            // Brišemo sve prijave za taj ispit
            var prijave = _context.RegistracijeIspita
                .Where(r => r.IspitId == ispitId);
            _context.RegistracijeIspita.RemoveRange(prijave);

            // Brišemo i sam ispit
            _context.Ispit.Remove(ispit);
            await _context.SaveChangesAsync();

            return RedirectToAction(nameof(MojiPredmeti));
        }

        // GET: Dekan/EditProfesorPredmeti/{id}
        [Authorize(Roles = "Dekan")]
        public async Task<IActionResult> EditProfesorPredmeti(string id)
        {
            var profesor = await _context.Users
                .Include(p => p.KorisnikPredmet)
                .FirstOrDefaultAsync(p => p.Id == id && p.uloga == Uloga.Profesor);

            if (profesor == null) return NotFound();

            var sviPredmeti = await _context.Predmet.ToListAsync();

            var model = new ProfesorPredmetiModel
            {
                ProfesorId = profesor.Id,
                ImePrezime = profesor.Ime + " " + profesor.Prezime,
                Predmeti = sviPredmeti.Select(p => new PredmetCheckboxModel
                {
                    PredmetID = p.PredmetID,
                    ImePredmeta = p.ImePredmeta,
                    IsSelected = profesor.KorisnikPredmet.Any(kp => kp.PredmetID == p.PredmetID)
                }).ToList()
            };

            return View("~/Views/Profesori/EditProfesorPredmeti.cshtml", model);

        }

        // POST: Dekan/EditProfesorPredmeti
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Dekan")]
        public async Task<IActionResult> EditProfesorPredmeti(ProfesorPredmetiModel model)
        {
            var profesor = await _context.Users
                .Include(p => p.KorisnikPredmet)
                .FirstOrDefaultAsync(p => p.Id == model.ProfesorId && p.uloga == Uloga.Profesor);

            if (profesor == null) return NotFound();

            // Obrisi stare predmete
            var stari = _context.KorisnikPredmet.Where(kp => kp.KorisnikId == profesor.Id);
            _context.KorisnikPredmet.RemoveRange(stari);

            // Dodaj nove
            foreach (var p in model.Predmeti.Where(p => p.IsSelected))
            {
                _context.KorisnikPredmet.Add(new KorisnikPredmet
                {
                    KorisnikId = profesor.Id,
                    PredmetID = p.PredmetID
                });
            }

            await _context.SaveChangesAsync();

            return RedirectToAction("Index"); // ili neka druga akcija nakon spremanja
        }



    }
}
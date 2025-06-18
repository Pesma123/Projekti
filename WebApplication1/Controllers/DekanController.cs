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
    [Authorize(Roles = "Dekan")]
    public class DekanController : Controller
    {
        private readonly UserManager<Korisnik> _userManager;
        private readonly ApplicationDbContext _context;

        public DekanController(
            UserManager<Korisnik> userManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        // GET: Dekan/EditPredmeti/{id}
        [HttpGet]
        public async Task<IActionResult> EditPredmeti(string id)
        {
            if (string.IsNullOrEmpty(id)) return NotFound();

            var student = await _context.Users
                .Include(u => u.KorisnikPredmet)
                .FirstOrDefaultAsync(u => u.Id == id && u.uloga == Uloga.Student);
            if (student == null) return NotFound();

            var sviPredmeti = await _context.Predmet.ToListAsync();
            var model = new StudentPredmetiModel
            {
                StudentId = student.Id,
                ImePrezime = $"{student.Ime} {student.Prezime}",
                Predmeti = sviPredmeti.Select(p => new PredmetOcjenaModel
                {
                    PredmetID = p.PredmetID,
                    ImePredmeta = p.ImePredmeta,
                    IsSelected = student.KorisnikPredmet.Any(kp => kp.PredmetID == p.PredmetID),
                    Ocjena = student.KorisnikPredmet
                                     .FirstOrDefault(kp => kp.PredmetID == p.PredmetID)?
                                     .Ocjena
                }).ToList()
            };

            return View(model);
        }

        // POST: Dekan/EditPredmeti
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditPredmeti(StudentPredmetiModel model)
        {
            // **1.** Provjeri binding i vidljivost grešaka:
            if (!ModelState.IsValid)
            {
                // repopuliraj listu predmeta ako nije validno
                var sviPredmeti = await _context.Predmet.ToListAsync();
                model.Predmeti = sviPredmeti.Select(p => new PredmetOcjenaModel
                {
                    PredmetID = p.PredmetID,
                    ImePredmeta = p.ImePredmeta,
                    IsSelected = model.Predmeti.Any(x => x.PredmetID == p.PredmetID && x.IsSelected),
                    Ocjena = model.Predmeti.FirstOrDefault(x => x.PredmetID == p.PredmetID)?.Ocjena
                }).ToList();

                // vrati view s greškama
                return View(model);
            }

            // **2.** Obriši stare veze
            _context.KorisnikPredmet
                    .RemoveRange(_context.KorisnikPredmet
                        .Where(kp => kp.KorisnikId == model.StudentId));

            // **3.** Dodaj nove selektirane predmete s ocjenama
            foreach (var pm in model.Predmeti.Where(x => x.IsSelected))
            {
                _context.KorisnikPredmet.Add(new KorisnikPredmet
                {
                    KorisnikId = model.StudentId,
                    PredmetID = pm.PredmetID,
                    Ocjena = pm.Ocjena
                });
            }

            await _context.SaveChangesAsync();

            // **4.** Redirect na listu studenata
            return RedirectToAction(nameof(PregledStudenata));
        }

        [Authorize(Roles = "Dekan")]
        public async Task<IActionResult> CreateStudent()
        {
            var model = new StudentCreateModel
            {
                PredmetiList = await _context.Predmet
                    .Select(p => new SelectListItem
                    {
                        Value = p.PredmetID.ToString(),
                        Text = p.ImePredmeta
                    }).ToListAsync()
            };

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Dekan")]
        public async Task<IActionResult> CreateStudent(StudentCreateModel model)
        {
            // Ako model nije validan, repopuliraj listu predmeta
            if (!ModelState.IsValid)
            {
                model.PredmetiList = await _context.Predmet
                    .Select(p => new SelectListItem
                    {
                        Value = p.PredmetID.ToString(),
                        Text = p.ImePredmeta
                    }).ToListAsync();

                return View(model);
            }

            // 1. Kreiraj korisnika (studenta)
            var student = new Korisnik
            {
                UserName = model.Email,
                Email = model.Email,
                Ime = model.Ime,
                Prezime = model.Prezime,
                EmailConfirmed = true,
                uloga = Uloga.Student,
                Indeks = model.Indeks,
                //DatumRodjenja = model.DatumRodjenja
            };

            // 2. Snimi korisnika u bazu sa default lozinkom
            var result = await _userManager.CreateAsync(student, "student");
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                    ModelState.AddModelError(string.Empty, error.Description);

                model.PredmetiList = await _context.Predmet
                    .Select(p => new SelectListItem
                    {
                        Value = p.PredmetID.ToString(),
                        Text = p.ImePredmeta
                    }).ToListAsync();

                return View(model);
            }

            // 3. Dodaj korisnika u rolu STUDENT
            await _userManager.AddToRoleAsync(student, "Student");

            // 4. Poveži studenta sa izabranim predmetima
            foreach (var predmetIdStr in model.SelectedPredmetIds)
            {
                if (int.TryParse(predmetIdStr, out int predmetId))
                {
                    _context.KorisnikPredmet.Add(new KorisnikPredmet
                    {
                        KorisnikId = student.Id,
                        PredmetID = predmetId
                    });
                }
            }

            // 5. Spasi sve u bazu
            await _context.SaveChangesAsync();

            return RedirectToAction(nameof(PregledStudenata));
        }


        [Authorize(Roles = "Dekan")]
        public async Task<IActionResult> DeleteStudent(string id)
        {
            if (string.IsNullOrEmpty(id)) return NotFound();

            var student = await _userManager.FindByIdAsync(id);
            if (student == null || student.uloga != Uloga.Student) return NotFound();

            return View(student);
        }
        [HttpPost, ActionName("DeleteStudent")]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = "Dekan")]
        public async Task<IActionResult> DeleteStudentConfirmed(string id)
        {
            if (string.IsNullOrEmpty(id)) return NotFound();

            var student = await _userManager.FindByIdAsync(id);
            if (student == null) return NotFound();

            var result = await _userManager.DeleteAsync(student);
            if (result.Succeeded)
                return RedirectToAction(nameof(PregledStudenata));

            ModelState.AddModelError("", "Brisanje nije uspjelo.");
            return View(student);
        }
        [Authorize(Roles = "Dekan")]
        public async Task<IActionResult> PregledStudenata()
        {
            var studenti = await _userManager.Users
                .Where(u => u.uloga == Uloga.Student)
                .ToListAsync();

            return View(studenti);
        }



    }
}

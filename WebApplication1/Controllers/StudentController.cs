using QRCoder;
using System.Drawing;
using System.Drawing.Imaging;
using System.Security.Claims;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;




namespace WebApplication1.Controllers
{
    [Authorize(Roles = "Student")]
    public class StudentController : Controller
    {
       

        private readonly UserManager<Korisnik> _userManager;
        private readonly ApplicationDbContext _context;

        public StudentController(
            UserManager<Korisnik> userManager,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        // GET: /Student/Uspjeh
        public async Task<IActionResult> Uspjeh()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Challenge();

            var veze = await _context.KorisnikPredmet
                .Where(kp => kp.KorisnikId == user.Id)
                .Include(kp => kp.Predmet)
                .ToListAsync();

            var model = veze
                .Select(kp => new PredmetOcjenaModel
                {
                    ImePredmeta = kp.Predmet.ImePredmeta,
                    Ocjena = kp.Ocjena
                })
                .ToList();

            return View(model);
        }

        // GET: /Student/PrijavaIspita
        public async Task<IActionResult> PrijavaIspita()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Challenge();

            // 1) Uzmi predmete gdje student nema ocjenu
            var neocijenjeni = await _context.KorisnikPredmet
                .Where(kp => kp.KorisnikId == user.Id && kp.Ocjena == null)
                .Select(kp => kp.PredmetID)
                .ToListAsync();

            // 2) Uzmi sve ispite koje student već jest prijavio
            var prijavljeni = await _context.RegistracijeIspita
                .Where(r => r.KorisnikId == user.Id)
                .Select(r => r.IspitId)
                .ToListAsync();

            // 3) Sve ispite za neocijenjene predmete + flag prijave
            var ispiti = await _context.Ispit
                .Include(i => i.predmet)
                .Where(i => neocijenjeni.Contains(i.PredmetID))
                .OrderBy(i => i.Datum)
                .Select(i => new IspitPrijavaModel
                {
                    IspitId = i.IspitId,
                    ImePredmeta = i.predmet.ImePredmeta,
                    Datum = i.Datum,
                    Prijavljen = prijavljeni.Contains(i.IspitId)
                })
                .ToListAsync();

            return View(ispiti);
        }

        // POST: /Student/PrijaviIspit
        [HttpPost, ValidateAntiForgeryToken]
        public async Task<IActionResult> PrijaviIspit(int ispitId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Challenge();

            bool exists = await _context.RegistracijeIspita
                .AnyAsync(r => r.KorisnikId == user.Id && r.IspitId == ispitId);

            if (!exists)
            {
                _context.RegistracijeIspita.Add(new RegistracijaIspita
                {
                    KorisnikId = user.Id,
                    IspitId = ispitId
                });
                await _context.SaveChangesAsync();
            }

            return RedirectToAction(nameof(PrijavaIspita));
        }

        // POST: /Student/OdjaviIspit
        [HttpPost, ValidateAntiForgeryToken]
        public async Task<IActionResult> OdjaviIspit(int ispitId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Challenge();

            var reg = await _context.RegistracijeIspita
                .FirstOrDefaultAsync(r => r.KorisnikId == user.Id && r.IspitId == ispitId);

            if (reg != null)
            {
                _context.RegistracijeIspita.Remove(reg);
                await _context.SaveChangesAsync();
            }

            return RedirectToAction(nameof(PrijavaIspita));
        }
        // GET: Forma za potvrdu
        public IActionResult IspisPotvrda()
        {
            return View(new PotvrdaViewModel());
        }

        // POST: Generisanje potvrde
        [HttpPost]
        public IActionResult IspisPotvrda(PotvrdaViewModel model)
        {
            var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var student = _context.Users.FirstOrDefault(u => u.Id == studentId);

            if (student == null)
            {
                return NotFound("Student nije pronađen.");
            }

            model.TekstPotvrde = $"Student {student.Ime} {student.Prezime}, broj indeksa {student.Indeks}, je redovno upisan u 2024/2025. godinu studija. Svrha potvrde: {model.SvrhaPotvrde}.";

            return View(model);
        }
        [HttpPost]
        public IActionResult GenerisiPdf(string svrhaPotvrde)
        {
            var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var student = _context.Users.FirstOrDefault(u => u.Id == studentId);

            if (student == null) return NotFound();

            string tekst = $"Student {student.Ime} {student.Prezime}, broj indeksa {student.Indeks}, je redovno upisan u 2024/2025. godinu studija.\nSvrha potvrde: {svrhaPotvrde}.";

            using (var stream = new MemoryStream())
            {
                var document = new PdfSharpCore.Pdf.PdfDocument();
                var page = document.AddPage();
                var gfx = PdfSharpCore.Drawing.XGraphics.FromPdfPage(page);
                var font = new PdfSharpCore.Drawing.XFont("Verdana", 12);

                gfx.DrawString(tekst, font, PdfSharpCore.Drawing.XBrushes.Black,
                    new PdfSharpCore.Drawing.XRect(40, 40, page.Width, page.Height),
                    PdfSharpCore.Drawing.XStringFormats.TopLeft);

                document.Save(stream, false);
                return File(stream.ToArray(), "application/pdf", "Potvrda.pdf");
            }
        }

        //QR KOD
        public IActionResult QRKodUspjeh()
        {
            // Generiše URL koji će QR kod sadržavati
            // Umjesto da vodi na UnosKoda, vodi na login
            string url = Url.Page("/Account/Login", null, new { area = "Identity", returnUrl = "/Javni/PrikazUspijeha" }, Request.Scheme);



            using var qrGenerator = new QRCodeGenerator();
            using var qrCodeData = qrGenerator.CreateQrCode(url, QRCodeGenerator.ECCLevel.Q);
            using var qrCode = new PngByteQRCode(qrCodeData);

            // Generiše QR kod kao PNG u bajtovima
            byte[] qrCodeAsPng = qrCode.GetGraphic(10);

            // Vraća sliku PNG nazad kao odgovor HTTP requesta
            return File(qrCodeAsPng, "image/png");
        }








    }
}

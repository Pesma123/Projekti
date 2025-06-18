using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class IspitController : Controller
    {
        private readonly ApplicationDbContext _context;

        public IspitController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Ispit
        public async Task<IActionResult> Index()
        {
            var applicationDbContext = _context.Ispit.Include(i => i.predmet);
            return View(await applicationDbContext.ToListAsync());
        }

        // GET: Ispit/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ispit = await _context.Ispit
                .Include(i => i.predmet)
                .FirstOrDefaultAsync(m => m.IspitId == id);
            if (ispit == null)
            {
                return NotFound();
            }

            return View(ispit);
        }

        // GET: Ispit/Create
        public IActionResult Create()
        {
            ViewData["PredmetID"] = new SelectList(_context.Predmet, "PredmetID", "PredmetID");
            return View();
        }

        // POST: Ispit/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("IspitId,PredmetID,Datum")] Ispit ispit)
        {
            if (ModelState.IsValid)
            {
                _context.Add(ispit);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["PredmetID"] = new SelectList(_context.Predmet, "PredmetID", "PredmetID", ispit.PredmetID);
            return View(ispit);
        }

        // GET: Ispit/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ispit = await _context.Ispit.FindAsync(id);
            if (ispit == null)
            {
                return NotFound();
            }
            ViewData["PredmetID"] = new SelectList(_context.Predmet, "PredmetID", "PredmetID", ispit.PredmetID);
            return View(ispit);
        }

        // POST: Ispit/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("IspitId,PredmetID,Datum")] Ispit ispit)
        {
            if (id != ispit.IspitId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(ispit);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!IspitExists(ispit.IspitId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["PredmetID"] = new SelectList(_context.Predmet, "PredmetID", "PredmetID", ispit.PredmetID);
            return View(ispit);
        }

        // GET: Ispit/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var ispit = await _context.Ispit
                .Include(i => i.predmet)
                .FirstOrDefaultAsync(m => m.IspitId == id);
            if (ispit == null)
            {
                return NotFound();
            }

            return View(ispit);
        }

        // POST: Ispit/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var ispit = await _context.Ispit.FindAsync(id);
            if (ispit != null)
            {
                _context.Ispit.Remove(ispit);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool IspitExists(int id)
        {
            return _context.Ispit.Any(e => e.IspitId == id);
        }
    }
}

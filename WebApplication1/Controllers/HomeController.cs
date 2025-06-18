using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Odsjeci()
        {
            return View();
        }
        public IActionResult Racunarstvo()
        {
            return View();
        }
        public IActionResult elektroenergetika()
        {
            return View();
        }
        public IActionResult Telekomunikacija()
        {
            return View();
        }
        public IActionResult Automatika()
        {
            return View();
        }
        public IActionResult Profesori()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

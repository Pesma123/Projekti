using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public class ProfesorCreateModel
    {
        public string Email { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string Lozinka { get; set; }
        public string Predmet { get; set; }
        public List<SelectListItem> Predmeti { get; set; } = new List<SelectListItem>();
    }
}


using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace WebApplication1.Models
{
    public class StudentCreateModel
    {
        [Required]
        public string Ime { get; set; }

        [Required]
        public string Prezime { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [RegularExpression(@"^\d{6}$", ErrorMessage = "Indeks mora imati tačno 6 cifara.")]
        public string Indeks { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DatumRodjenja { get; set; }

        // Lista predmeta koji se prikazuju u formi kao checkboxovi
        public List<SelectListItem> PredmetiList { get; set; } = new List<SelectListItem>();

        // Lista ID-eva izabranih predmeta (checkboxovi)
        public List<string> SelectedPredmetIds { get; set; } = new List<string>();
    }
}

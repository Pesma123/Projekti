using System;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class DodajIspitViewModel
    {
        [Required]
        public int PredmetId { get; set; }

        [Required]  // Datum ipak želite validirati
        [Display(Name = "Datum i vrijeme ispita")]
        [DataType(DataType.DateTime)]
        public DateTime Datum { get; set; }

        // više nema Required
        public string? ImePredmeta { get; set; }
    }
}

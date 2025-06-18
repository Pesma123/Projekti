using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class Predmet
    {
        [Key]
        public int PredmetID { get; set; } // Uklonio sam nullable jer je ovo primarni ključ

        [Required]
        public string ImePredmeta { get; set; } = string.Empty;

        [Required]
        public int BrojECTS { get; set; }

        public Korisnik? Profesor { get; set; }

        [ForeignKey("Profesor")]
        public string? ProfesorID { get; set; } // Ovdje je dobro postaviti nullable

        public Semestar Semestar { get; set; }

        public ICollection<KorisnikPredmet> KorisnikPredmet { get; set; }
    }
}

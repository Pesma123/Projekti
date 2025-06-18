using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
namespace WebApplication1.Models
{
    public class Korisnik: IdentityUser
    {
        [Required]
        public string Ime { get; set; }
        [Required]
        public string Prezime { get; set; }
        [Required]
        public string Email {get; set; }

        public string? Predmet { get; set; }

        [DataType(DataType.Date)]
        public DateTime datumRodjenja { get; set; }

      
        public string? Indeks { get; set; }

        //public string Lozinka {get; set;}
        public Uloga uloga {get; set;}
        private Boolean verifikovano { get; set; }
        public ICollection<KorisnikPredmet> KorisnikPredmet { get; set; }

    }
}

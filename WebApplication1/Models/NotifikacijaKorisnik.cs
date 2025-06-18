using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class NotifikacijaKorisnik
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Korisnik")]
        public string KorisnikId { get; set; }
        public Korisnik Korisnik { get; set; }
        [ForeignKey("Notifikacija")]
        public int NotifikacijaID { get; set; }
        private Notifikacija Notifikacija { get; set; }
        public NotifikacijaKorisnik() { }
    }
}

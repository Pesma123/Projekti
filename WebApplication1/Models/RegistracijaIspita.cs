using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class RegistracijaIspita
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Ispit")]
        public int IspitId { get; set; }
        public Ispit Ispit { get; set; }

        [ForeignKey("Korisnik")]
        public string KorisnikId { get; set; }
        public Korisnik Korisnik { get; set; }
    }
}

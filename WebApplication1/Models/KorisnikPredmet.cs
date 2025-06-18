using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class KorisnikPredmet
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Korisnik")]
        public string KorisnikId { get; set; }
        public Korisnik Korisnik { get; set; }

        [ForeignKey("Predmet")]
        public int PredmetID { get; set; }
        public Predmet Predmet { get; set; }

        // == NOVO: ocjena studenta za taj predmet ==
        public int? Ocjena { get; set; }

        public KorisnikPredmet() { }
    }
}

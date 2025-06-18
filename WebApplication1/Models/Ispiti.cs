using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models
{
    public class Ispit
    {
        [Key]
        public int IspitId { get; set; }

        [ForeignKey("Predmet")]
        public int PredmetID { get; set; }
        public Predmet predmet { get; set; }
        public DateTime Datum { get; set; }

    }
}

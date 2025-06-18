using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class Notifikacija
    {
        [Key]
        public int NotifikacijaId { get; set; }
        public string Poruka { get; set; }
        public DateTime DatumSlanja { get; set; }
    }
}

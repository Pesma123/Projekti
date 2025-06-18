using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class Izvjestaj
    {
        [Key]
        public int IzvjestajId { get; set; }
        public string Sadrzaj { get; set; }
    }
}

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace WebApplication1.Models
{
    public class PredmetOcjenaModel
    {
        public int PredmetID { get; set; }
        public string ImePredmeta { get; set; }
        public bool IsSelected { get; set; }
        public int? Ocjena { get; set; }
    }

    public class StudentPredmetiModel
    {
        [Required]
        public string StudentId { get; set; }
        public string ImePrezime { get; set; }
        public List<PredmetOcjenaModel> Predmeti { get; set; } = new();
    }

}

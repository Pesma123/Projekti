using System.Collections.Generic;

namespace WebApplication1.Models
{
    public class PredmetIspitiRegistracijaViewModel
    {
        public int PredmetID { get; set; }
        public string ImePredmeta { get; set; }
        public int BrojECTS { get; set; }
        public List<IspitRegistracijaModel> Ispiti { get; set; } = new();
    }
}
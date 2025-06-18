using System;

namespace WebApplication1.Models
{
    public class IspitPrijavaModel
    {
        public int IspitId { get; set; }
        public string ImePredmeta { get; set; }
        public DateTime Datum { get; set; }

        // NOVO: da znaš prikazati dugme Prijavi/Odjavi
        public bool Prijavljen { get; set; }
    }
}

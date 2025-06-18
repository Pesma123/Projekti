using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public class IspitRegistracijaModel
    {
        public int IspitId { get; set; }
        public DateTime Datum { get; set; }

        // Promijeni ovo:
        public List<Korisnik> Prijavljeni { get; set; } = new();
        public List<Korisnik> PrijavljeniStudenti { get; internal set; }
    }
}

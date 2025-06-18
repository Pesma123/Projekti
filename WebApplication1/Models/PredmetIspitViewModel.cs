using System;
using System.Collections.Generic;

namespace WebApplication1.Models
{
    public class PredmetIspitiViewModel
    {
        public int PredmetID { get; set; }
        public string ImePredmeta { get; set; }
        public int BrojECTS { get; set; }

        // Lista ispita za taj predmet
        public List<Ispit> Ispiti { get; set; } = new();
    }
}

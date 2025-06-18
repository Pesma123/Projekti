using System.Collections.Generic;


namespace WebApplication1.Models
{
    public class ProfesorPredmetiModel
    {
        public string ProfesorId { get; set; }
        public string ImePrezime { get; set; }
        public List<PredmetCheckboxModel> Predmeti { get; set; }
    }

    public class PredmetCheckboxModel
    {
        public int PredmetID { get; set; }
        public string ImePredmeta { get; set; }
        public bool IsSelected { get; set; }
    }
}

namespace TrashInspection.Pn.Infrastructure.Models.Producers
{
    public class ProducersYearRequestModel
    {
        public string Sort { get; set; }
        
        //public string NameFilter { get; set; }
        
        public bool IsSortDsc { get; set; }
        
        public int Year { get; set; }
    }
}
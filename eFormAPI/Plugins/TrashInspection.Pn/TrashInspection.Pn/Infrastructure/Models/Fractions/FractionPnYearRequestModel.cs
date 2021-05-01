namespace TrashInspection.Pn.Infrastructure.Models.Fractions
{
    public class FractionPnYearRequestModel
    {
        public string Sort { get; set; }
        
        public bool IsSortDsc { get; set; }
        
        public int Year { get; set; }
    }
}
namespace TrashInspection.Pn.Infrastructure.Models.Transporters
{
    public class TransportersYearRequestModel
    {
        public string Sort { get; set; }
        
        public bool IsSortDsc { get; set; }

        public int Year { get; set; }
    }
}
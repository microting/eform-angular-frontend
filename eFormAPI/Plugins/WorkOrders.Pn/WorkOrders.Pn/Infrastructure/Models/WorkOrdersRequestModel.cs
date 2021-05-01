namespace WorkOrders.Pn.Infrastructure.Models
{
    public class WorkOrdersRequestModel
    {
        public string SearchString { get; set; }
        public string Sort { get; set; }
        public int Offset { get; set; }
        public int PageSize { get; set; }
        public bool IsSortDsc { get; set; }
        public WorkOrdersRequestModel()
        {
            Sort = "Id";
            IsSortDsc = true;
            PageSize = 10;
            Offset = 0;
        }
    }
}

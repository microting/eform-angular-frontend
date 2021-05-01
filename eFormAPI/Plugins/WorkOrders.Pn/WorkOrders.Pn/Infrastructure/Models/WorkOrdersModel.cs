using System.Collections.Generic;

namespace WorkOrders.Pn.Infrastructure.Models
{
    public class WorkOrdersModel
    {
        public int Total { get; set; } = 0;
        public List<WorkOrderModel> WorkOrders { get; set; } 
        public WorkOrdersModel()
        {
            WorkOrders = new List<WorkOrderModel>();
        }
    }
}

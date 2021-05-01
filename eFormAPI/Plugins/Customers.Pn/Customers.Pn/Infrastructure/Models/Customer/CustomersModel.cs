using System.Collections.Generic;

namespace Customers.Pn.Infrastructure.Models.Customer
{
    public class CustomersModel
    {
        public int Total { get; set; }
        public List<CustomerModel> Customers { get; set; }

        public CustomersModel()
        {
            Customers = new List<CustomerModel>();
        }
    }
}

using System.Collections.Generic;

namespace Customers.Pn.Infrastructure.Models.Customer
{
    public class CustomersPnModel
    {
        public int Total { get; set; }
        public List<CustomerPnModel> Customers { get; set; }

        public CustomersPnModel()
        {
            Customers = new List<CustomerPnModel>();
        }
    }
}

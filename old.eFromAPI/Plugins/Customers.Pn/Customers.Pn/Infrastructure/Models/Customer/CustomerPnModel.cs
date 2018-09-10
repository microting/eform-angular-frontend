using System.Collections.Generic;
using Customers.Pn.Infrastructure.Models.Fields;

namespace Customers.Pn.Infrastructure.Models.Customer
{
    public class CustomerPnModel
    {
        public int Id { get; set; }
        public List<FieldPnModel> Fields { get; set; } = new List<FieldPnModel>();
    }
}
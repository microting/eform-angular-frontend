using System.Collections.Generic;

namespace Customers.Pn.Infrastructure.Models.Fields
{
    public class FieldsPnUpdateModel
    {
        public List<FieldPnUpdateModel> Fields { get; set; } = new List<FieldPnUpdateModel>();
    }
}
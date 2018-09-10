using Customers.Pn.Enums;

namespace Customers.Pn.Infrastructure.Models.Fields
{
    public class FieldPnUpdateModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public FieldPnStatus FieldStatus { get; set; }
    }
}
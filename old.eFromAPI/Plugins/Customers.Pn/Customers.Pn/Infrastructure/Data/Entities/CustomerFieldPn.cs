using Customers.Pn.Enums;
using eFormApi.BasePn.Infrastructure.Data.Base;

namespace Customers.Pn.Infrastructure.Data.Entities
{
    public class CustomerFieldPn : BaseEntity
    {
        public int FieldId { get; set; }
        public FieldPn Field { get; set; }

        public FieldPnStatus FieldStatus { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;
using eFormApi.BasePn.Infrastructure.Data.Base;

namespace Customers.Pn.Infrastructure.Data.Entities
{
    public class FieldPn : BaseEntity
    {
        [StringLength(50)]
        public string Name { get; set; }
    }
}
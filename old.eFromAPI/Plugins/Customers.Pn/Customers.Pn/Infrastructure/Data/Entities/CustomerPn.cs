using System;
using System.ComponentModel.DataAnnotations;
using eFormApi.BasePn.Infrastructure.Data.Base;

namespace Customers.Pn.Infrastructure.Data.Entities
{
    public class CustomerPn : BaseEntity
    {
        public DateTime CreatedDate { get; set; }

        [StringLength(250)]
        public string CreatedBy { get; set; }
        public int? CustomerNo { get; set; }
        [StringLength(250)]
        public string CompanyName { get; set; }
        [StringLength(250)]
        public string CompanyAddress { get; set; }
        [StringLength(50)]
        public string ZipCode { get; set; }
        [StringLength(250)]
        public string CityName { get; set; }
        [StringLength(250)]
        public string Phone { get; set; }
        [StringLength(250)]
        public string Email { get; set; }
        [StringLength(250)]
        public string ContactPerson { get; set; }
        public string Description { get; set; }
    }
}
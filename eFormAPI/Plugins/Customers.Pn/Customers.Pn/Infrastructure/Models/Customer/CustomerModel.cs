using System;
using System.Collections.Generic;
using Customers.Pn.Infrastructure.Models.Fields;

namespace Customers.Pn.Infrastructure.Models.Customer
{
    public class CustomerModel
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public string CustomerNo { get; set; }
        public string CompanyName { get; set; }
        public string CompanyAddress { get; set; }
        public string CompanyAddress2 { get; set; }
        public string ZipCode { get; set; }
        public string CityName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string ContactPerson { get; set; }
        public string Description { get; set; }
        public int? RelatedEntityId { get; set; }
        public string EanCode { get; set; }
        public string VatNumber { get; set; }
        public string CountryCode { get; set; }
        public int? CrmId { get; set; }
        public string CadastralNumber { get; set; }
        public int? PropertyNumber { get; set; }
        public int? ApartmentNumber { get; set; }
        public int? CompletionYear { get; set; }
        public int? FloorsWithLivingSpace { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdateAt { get; set; }
        public int CreatedByUserId { get; set; }
        public int UpdatedByUserId { get; set; }
        public string WorkflowState { get; set; }
        public int Version { get; set; }
        public int? CadastralType { get; set; }
        public string FullName { get; set; }
    }
}
using System;
using Customers.Pn.Infrastructure.Models.Customer;
using Newtonsoft.Json.Linq;

namespace Customers.Pn.Infrastructure.Helpers
{
    public static class CustomersHelper
    {
        public static CustomerFullModel ComposeValues(CustomerFullModel customer, JToken headers, JToken customerObj)
        {
            if (int.TryParse(headers[0]["headerValue"].ToString(), out var locationId))
            {
                customer.CityName = customerObj[locationId].ToString(); // Cityname
            }
            if (int.TryParse(headers[1]["headerValue"].ToString(), out locationId))
            {
                customer.CompanyAddress = customerObj[locationId].ToString(); //CompanyAddress
            }
            if (int.TryParse(headers[2]["headerValue"].ToString(), out locationId))
            {
                customer.CompanyAddress2 = customerObj[locationId].ToString(); //CompanyAddress2
            }
            if (int.TryParse(headers[3]["headerValue"].ToString(), out locationId))
            {
                customer.CompanyName = customerObj[locationId].ToString(); //Companyname
            }
            if (int.TryParse(headers[4]["headerValue"].ToString(), out locationId))
            {
                customer.ContactPerson = customerObj[locationId].ToString(); //Contactperson
            }
            if (int.TryParse(headers[5]["headerValue"].ToString(), out locationId))
            {
                customer.CustomerNo = customerObj[locationId].ToString(); //CustomerNumber
            }

            customer.CreatedDate = DateTime.UtcNow; // Createddate

            if (int.TryParse(headers[6]["headerValue"].ToString(), out locationId))
            {
                customer.Description = customerObj[locationId].ToString(); //Description
            }
            if (int.TryParse(headers[7]["headerValue"].ToString(), out locationId))
            {
                customer.Email = customerObj[locationId].ToString(); //Email
            }
            if (int.TryParse(headers[8]["headerValue"].ToString(), out locationId))
            {
                customer.Phone = customerObj[locationId].ToString(); //Phonenumber
            }
            if (int.TryParse(headers[9]["headerValue"].ToString(), out locationId))
            {
                customer.ZipCode = customerObj[locationId].ToString(); //Zipcode
            }
            if (int.TryParse(headers[10]["headerValue"].ToString(), out locationId))
            {
                customer.EanCode = customerObj[locationId].ToString(); //EanCode
            }
            if (int.TryParse(headers[11]["headerValue"].ToString(), out locationId))
            {
                customer.VatNumber = customerObj[locationId].ToString(); //VatNumber
            }
            if (int.TryParse(headers[12]["headerValue"].ToString(), out locationId))
            {
                customer.CountryCode = customerObj[locationId].ToString(); //CountryCode
            }

            return customer;
        }
    }
}

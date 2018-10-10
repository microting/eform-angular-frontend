using System;
using System.Diagnostics;
using System.Linq;
using System.Web.Http;
using Customers.Pn.Enums;
using Customers.Pn.Helpers;
using Customers.Pn.Infrastructure.Data;
using Customers.Pn.Infrastructure.Data.Entities;
using Customers.Pn.Infrastructure.Extensions;
using Customers.Pn.Infrastructure.Models.Customer;
using Customers.Pn.Infrastructure.Models.Fields;
using eFormApi.BasePn.Infrastructure.Models.API;
using NLog;

namespace Customers.Pn.Controllers
{
    [Authorize]
    public class CustomersPnController : ApiController
    {
        private readonly Logger _logger;
        private readonly CustomersPnDbContext _dbContext;

        public CustomersPnController()
        {
            _dbContext = CustomersPnDbContext.Create();
            _logger = LogManager.GetCurrentClassLogger();
        }

        [HttpPost]
        [Route("api/customers-pn/get-all")]
        public OperationDataResult<CustomersPnModel> GetCustomers(CustomersPnRequestModel pnRequestModel)
        {
            try
            {
                var customersPnModel = new CustomersPnModel();
                var customersQuery = _dbContext.Customers.AsQueryable();
                if (!string.IsNullOrEmpty(pnRequestModel.SortColumnName))
                {
                    if (pnRequestModel.IsSortDsc)
                    {
                        customersQuery = customersQuery
                            .OrderByDescending(pnRequestModel.SortColumnName);
                    }
                    else
                    {
                        customersQuery = customersQuery
                            .OrderBy(pnRequestModel.SortColumnName);
                    }
                }
                else
                {
                    customersQuery = _dbContext.Customers
                        .OrderBy(x => x.Id);
                }

                customersQuery = customersQuery
                    .Skip(pnRequestModel.Offset)
                    .Take(pnRequestModel.PageSize);

                var customers = customersQuery.ToList();
                customersPnModel.Total = _dbContext.Customers.Count();
                var fields = _dbContext.CustomerFields
                    .Include("Field")
                    .Select(x => new FieldPnUpdateModel()
                    {
                        FieldStatus = x.FieldStatus,
                        Id = x.FieldId,
                        Name = x.Field.Name,
                    }).ToList();

                foreach (var customer in customers)
                {
                    var customerModel = new CustomerPnModel()
                    {
                        Id = customer.Id,
                    };
                    foreach (var field in fields)
                    {
                        if (field.FieldStatus == FieldPnStatus.Enabled)
                        {
                            var fieldModel = new FieldPnModel
                            {
                                Id = field.Id,
                                Name = field.Name,
                            };
                            var val = customer.GetPropValue(field.Name);
                            if (val != null)
                            {
                                fieldModel.Value = val.ToString();
                            }

                            customerModel.Fields.Add(fieldModel);
                        }
                    }

                    if (customerModel.Fields.Any())
                    {
                        // Mode Id field to top
                        var index = customerModel.Fields.FindIndex(x => x.Name == "Id");
                        var item = customerModel.Fields[index];
                        customerModel.Fields[index] = customerModel.Fields[0];
                        customerModel.Fields[0] = item;
                    }

                    customersPnModel.Customers.Add(customerModel);
                }

                return new OperationDataResult<CustomersPnModel>(true, customersPnModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.Error(e);
                return new OperationDataResult<CustomersPnModel>(false,
                    CustomersPnLocaleHelper.GetString("ErrorObtainingCustomersInfo"));
            }
        }

        [HttpGet]
        [Route("api/customers-pn/{id}")]
        public OperationDataResult<CustomerPnFullModel> GetSingleCustomer(int id)
        {
            try
            {
                var customer = _dbContext.Customers.Select(x => new CustomerPnFullModel()
                    {
                        Id = x.Id,
                        Description = x.Description,
                        Phone = x.Phone,
                        CityName = x.CityName,
                        CustomerNo = x.CustomerNo,
                        ZipCode = x.ZipCode,
                        Email = x.Email,
                        ContactPerson = x.ContactPerson,
                        CreatedBy = x.CreatedBy,
                        CompanyAddress = x.CompanyAddress,
                        CompanyName = x.CompanyName,
                    })
                    .FirstOrDefault(x => x.Id == id);

                if (customer == null)
                {
                    return new OperationDataResult<CustomerPnFullModel>(false,
                        CustomersPnLocaleHelper.GetString("CustomerNotFound"));
                }

                return new OperationDataResult<CustomerPnFullModel>(true, customer);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.Error(e);
                return new OperationDataResult<CustomerPnFullModel>(false,
                    CustomersPnLocaleHelper.GetString("ErrorObtainingCustomersInfo"));
            }
        }

        [HttpPost]
        [Route("api/customers-pn")]
        public OperationResult CreateCustomer(CustomerPnFullModel customerPnCreateModel)
        {
            try
            {
                var customer = new CustomerPn()
                {
                    CityName = customerPnCreateModel.CityName,
                    CompanyAddress = customerPnCreateModel.CompanyAddress,
                    CompanyName = customerPnCreateModel.CompanyName,
                    ContactPerson = customerPnCreateModel.ContactPerson,
                    CreatedBy = customerPnCreateModel.CreatedBy,
                    CustomerNo = customerPnCreateModel.CustomerNo,
                    CreatedDate = DateTime.UtcNow,
                    Description = customerPnCreateModel.Description,
                    Email = customerPnCreateModel.Email,
                    Phone = customerPnCreateModel.Phone,
                    ZipCode = customerPnCreateModel.ZipCode
                };
                _dbContext.Customers.Add(customer);
                _dbContext.SaveChanges();
                return new OperationResult(true,
                    CustomersPnLocaleHelper.GetString("CustomerCreated"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.Error(e);
                return new OperationResult(false,
                    CustomersPnLocaleHelper.GetString("ErrorWhileCreatingCustomer"));
            }
        }

        [HttpPut]
        [Route("api/customers-pn")]
        public OperationResult UpdateCustomer(CustomerPnFullModel customerUpdateModel)
        {
            try
            {
                var customer = _dbContext.Customers.FirstOrDefault(x => x.Id == customerUpdateModel.Id);
                if (customer == null)
                {
                    return new OperationResult(false,
                        CustomersPnLocaleHelper.GetString("CustomerNotFound"));
                }

                customer.Description = customerUpdateModel.Description;
                customer.CityName = customerUpdateModel.CityName;
                customer.CompanyAddress = customerUpdateModel.CompanyAddress;
                customer.ContactPerson = customerUpdateModel.ContactPerson;
                customer.CreatedBy = customerUpdateModel.CreatedBy;
                customer.CustomerNo = customerUpdateModel.CustomerNo;
                customer.CompanyName = customerUpdateModel.CompanyName;
                customer.Email = customerUpdateModel.Email;
                customer.Phone = customerUpdateModel.Phone;
                customer.ZipCode = customerUpdateModel.ZipCode;
                _dbContext.SaveChanges();
                return new OperationDataResult<CustomersPnModel>(true,
                    CustomersPnLocaleHelper.GetString("CustomerUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.Error(e);
                return new OperationDataResult<CustomersPnModel>(false,
                    CustomersPnLocaleHelper.GetString("ErrorWhileUpdatingCustomerInfo"));
            }
        }


        [HttpDelete]
        [Route("api/customers-pn/{id}")]
        public OperationResult DeleteCustomer(int id)
        {
            try
            {
                var customer = _dbContext.Customers.FirstOrDefault(x => x.Id == id);
                if (customer == null)
                {
                    return new OperationResult(false,
                        CustomersPnLocaleHelper.GetString("CustomerNotFound"));
                }

                _dbContext.Customers.Remove(customer);
                _dbContext.SaveChanges();
                return new OperationResult(true,
                    CustomersPnLocaleHelper.GetString("CustomerDeletedSuccessfully"));
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _logger.Error(e);
                return new OperationDataResult<CustomerPnFullModel>(false,
                    CustomersPnLocaleHelper.GetString("ErrorWhileDeletingCustomer"));
            }
        }
    }
}
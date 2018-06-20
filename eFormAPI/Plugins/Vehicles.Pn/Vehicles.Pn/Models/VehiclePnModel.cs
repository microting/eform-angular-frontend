using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vehicles.Pn.Models
{
    public class VehiclePnModel
    {
        public int Id { get; set; }
        public string ContactNumber { get; set; }
        public string CustomerName { get; set; }
        public string Brand { get; set; }
        public string ModelName { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string WinNumber { get; set; }
        public DateTime ContractStartDate { get; set; }
        public DateTime ContractEndDate { get; set; }
    }
}

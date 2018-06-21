using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vehicles.Pn.Models
{
    public class VehiclesPnModel
    {
        public int Total { get; set; }
        public List<VehiclePnModel> Vehicles { get; set; }

        public VehiclesPnModel()
        {
            Vehicles = new List<VehiclePnModel>();
        }
    }
}

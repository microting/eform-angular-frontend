using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vehicles.Pn.Models
{
    public class VehiclesPnRequestModel
    {
        public string SortColumnName { get; set; }
        public int PageIndex { get; set; }
        public int Offset { get; set; }
        public int PageSize { get; set; }
        public bool IsSortDsc { get; set; }
    }
}

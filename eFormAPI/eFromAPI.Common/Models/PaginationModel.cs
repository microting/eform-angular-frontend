using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eFromAPI.Common.Models
{
    public class PaginationModel
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int Offset { get; set; }
    }
}

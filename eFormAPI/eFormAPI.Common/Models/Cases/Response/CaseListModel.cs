using System.Collections.Generic;
using eFormShared;

namespace eFormAPI.Common.Models.Cases.Response
{
    public class CaseListModel
    {
        public int NumOfElements { get; set; }
        public int PageNum { get; set; }
        public List<Case> Cases { get; set; }
    }
}
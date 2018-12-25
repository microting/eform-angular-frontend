using System.Collections.Generic;
using eFormShared;

namespace Microting.eFormApi.BasePn.Infrastructure.Models.Cases.Response
{
    public class CaseListModel
    {
        public int NumOfElements { get; set; }
        public int PageNum { get; set; }
        public List<Case> Cases { get; set; }
    }
}
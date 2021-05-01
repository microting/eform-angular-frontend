using System.Collections.Generic;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TrashInspectionCaseVersionsModel
    {
        public int Total { get; set; }
        
        public int NumOfElements { get; set; }
        
        public int PageNum { get; set; }
        
        public string Token { get; set; }
        
        public List<TrashInspectionCaseVersion> TrashInspectionCaseVersionList { get; set; }
    }
}
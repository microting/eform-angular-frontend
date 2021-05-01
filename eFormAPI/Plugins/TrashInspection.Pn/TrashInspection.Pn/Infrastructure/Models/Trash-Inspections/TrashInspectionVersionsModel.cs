using System.Collections.Generic;

namespace TrashInspection.Pn.Infrastructure.Models
{
    public class TrashInspectionVersionsModel
    {
        public string Token { get; set; }
        
        public List<TrashInspectionVersionModel> TrashInspectionVersionList { get; set; }
        
        public List<TrashInspectionCaseStatusModel> TrashInspectionCaseStatusModels { get; set; } 
        
        public int TrashInspectionId { get; set; }
        
    }
}
using System;
using System.Collections.Generic;

namespace WorkOrders.Pn.Infrastructure.Models
{
    public class WorkOrderModel
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CreatedByUserId { get; set; }
        public string CreatedBy { get; set; }
        public string Description { get; set; }
        public DateTime CorrectedAtLatest { get; set; }
        public DateTime? DoneAt { get; set; }
        public int DoneBySiteId { get; set; }
        public string DoneBy { get; set; }
        public string DescriptionOfTaskDone { get; set; }
        public string AssignedArea { get; set; }
        public string AssignedWorker { get; set; }

        public List<string> PicturesOfTask { get; set; } = new List<string>();
        public List<string> PicturesOfTaskDone { get; set; } = new List<string>();
    }
}

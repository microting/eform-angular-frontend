namespace ItemsGroupPlanning.Pn.Infrastructure.Models
{
    using System;

    public class ItemsListPnCaseResultModel
    {
        public int Id { get; set; }
        
        public DateTime? DeployedAt { get; set; }
        
        public DateTime? DoneAt { get; set; }
        
        public string DoneByUserName { get; set; }
        
        public string Label { get; set; }
        
        public string Description { get; set; }
        
        public string BuildYear { get; set; }
        
        public string LocationCode { get; set; }
        
        public string ItemNumber { get; set; }
        
        public string Type { get; set; }
        
        public string Field1 { get; set; }

        public string Field2 { get; set; }

        public string Field3 { get; set; }

        public string Field4 { get; set; }

        public string Field5 { get; set; }

        public string Field6 { get; set; }

        public string Field7 { get; set; }

        public string Field8 { get; set; }

        public string Field9 { get; set; }

        public string Field10 { get; set; }
        
        public int Status { get; set; }
        
        public int SdkCaseId { get; set; }
        
        public int SdkeFormId { get; set; }
        
        public int NumberOfImages { get; set; }
        
        public string Token { get; set; }
    }
}
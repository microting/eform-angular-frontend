namespace ItemsGroupPlanning.Pn.Infrastructure.Models
{
    using System.Collections.Generic;

    public class UploadedDatasModel
    {
        public int Total { get; set; }
        public List<UploadedDataModel> UploadedDatas { get; set; } 
            = new List<UploadedDataModel>();
    }
}
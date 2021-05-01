namespace ItemsGroupPlanning.Pn.Infrastructure.Models
{
    using Microsoft.AspNetCore.Http;

    public class UploadedDataPDFUploadModel
    {
        public IFormFile File { get; set; }
        public int ItemCaseId { get; set; }
        
    }
}
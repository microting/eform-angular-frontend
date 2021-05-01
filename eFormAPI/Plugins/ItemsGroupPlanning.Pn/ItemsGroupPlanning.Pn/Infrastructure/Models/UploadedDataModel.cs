namespace ItemsGroupPlanning.Pn.Infrastructure.Models
{
    public class UploadedDataModel
    {
        public int Id { get; set; }
        
        public int ItemCaseId { get; set; }
        
        public string Checksum { get; set; }

        public string Extension { get; set; }

        public string CurrentFile { get; set; }

        public string UploaderType { get; set; }

        public string FileLocation { get; set; }

        public string FileName { get; set; }

    }
}
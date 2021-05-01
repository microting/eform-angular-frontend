namespace ItemsGroupPlanning.Pn.Infrastructure.Models
{
    using System.IO;

    public class FileStreamModel
    {
        public string FilePath { get; set; }
        public FileStream FileStream { get; set; }
    }
}

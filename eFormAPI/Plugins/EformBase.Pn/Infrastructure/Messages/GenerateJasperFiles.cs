namespace EformBase.Pn.Infrastructure.Messages
{
    public class GenerateJasperFiles
    {
        public int TemplateId { get; protected set; }

        public GenerateJasperFiles(int templateId)
        {
            this.TemplateId = templateId;
        }
    }
}

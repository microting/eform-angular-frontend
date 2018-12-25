using System.Collections.Generic;
using eFormShared;

namespace Microting.eFormApi.BasePn.Infrastructure.Models.Templates
{
    public class TemplateListModel
    {
        public TemplateListModel()
        {
        }

        public TemplateListModel(int numOfElements, int pageNum, List<Template_Dto> templates)
        {
            NumOfElements = numOfElements;
            PageNum = pageNum;
            Templates = templates;
        }

        public int NumOfElements { get; set; }

        public int PageNum { get; set; }

        public List<Template_Dto> Templates { get; set; }
    }
}
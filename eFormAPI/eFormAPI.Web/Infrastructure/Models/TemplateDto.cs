using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Dto;

namespace eFormAPI.Web.Infrastructure.Models
{
    public class TemplateDto
    {
        public int Id { get; set; }
        
        public DateTime? CreatedAt { get; set; }
        
        public DateTime? UpdatedAt { get; set; }
        
        public string Label { get; set; }

        public string Description { get; set; }

        public int Repeated { get; set; }

        
        public string FolderName { get; set; }

        public string WorkflowState { get; set; }

        public List<SiteNameDto> DeployedSites { get; set; }

        public bool HasCases { get; set; }

        public int? DisplayIndex { get; set; }

        public FieldDto Field1 { get; set; }

        public FieldDto Field2 { get; set; }

        public FieldDto Field3 { get; set; }

        public FieldDto Field4 { get; set; }

        public FieldDto Field5 { get; set; }

        public FieldDto Field6 { get; set; }

        public FieldDto Field7 { get; set; }

        public FieldDto Field8 { get; set; }

        public FieldDto Field9 { get; set; }

        public FieldDto Field10 { get; set; }

        public bool JasperExportEnabled { get; set; }
        
        public bool DocxExportEnabled { get; set; }

        public List<KeyValuePair<int, string>> Tags { get; set; }
        
        public bool IsLocked { get; set; }

        public static implicit operator TemplateDto(Microting.eForm.Dto.Template_Dto templateDto)
        {
            return new TemplateDto()
            {
                Id = templateDto.Id,
                
            };
        }

        public async Task CheckForLock(BaseDbContext dbContext)
        {
            List<string> plugins = await dbContext.EformPlugins.Select(x => x.PluginId).ToListAsync();

            foreach (string plugin in plugins)
            {
                if (Label.Contains(plugin))
                {
                    IsLocked = true;
                }
            }
        }
    }
}
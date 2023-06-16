namespace eFormAPI.Web.Infrastructure.Models;

using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microting.EformAngularFrontendBase.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microting.eForm.Dto;

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
    public bool ExcelExportEnabled { get; set; }

    public List<KeyValuePair<int, string>> Tags { get; set; }

    public bool IsLocked { get; set; }

    public bool IsEditable { get; set; }

    public int? FolderId { get; set; }

    public bool IsAchievable { get; set; }

    public bool IsDoneAtEditable { get; set; }

    public static implicit operator TemplateDto(Template_Dto templateDto)
    {
        return new TemplateDto()
        {
            Id = templateDto.Id,
            CreatedAt = templateDto.CreatedAt,
            UpdatedAt = templateDto.UpdatedAt,
            Label = templateDto.Label,
            Description = templateDto.Description,
            Repeated = templateDto.Repeated,
            FolderName = templateDto.FolderName,
            WorkflowState = templateDto.WorkflowState,
            DeployedSites = templateDto.DeployedSites,
            HasCases = templateDto.HasCases,
            DisplayIndex = templateDto.DisplayIndex,
            Field1 = templateDto.Field1,
            Field2 = templateDto.Field2,
            Field3 = templateDto.Field3,
            Field4 = templateDto.Field4,
            Field5 = templateDto.Field5,
            Field6 = templateDto.Field6,
            Field7 = templateDto.Field7,
            Field8 = templateDto.Field8,
            Field9 = templateDto.Field9,
            Field10 = templateDto.Field10,
            JasperExportEnabled = templateDto.JasperExportEnabled,
            DocxExportEnabled = templateDto.DocxExportEnabled,
            ExcelExportEnabled = templateDto.ExcelExportEnabled,
            Tags = templateDto.Tags,
            FolderId = templateDto.FolderId,
            IsLocked = templateDto.IsLocked,
            IsEditable = templateDto.IsEditable,
            IsAchievable = templateDto.IsAchievable,
            IsDoneAtEditable = templateDto.IsDoneAtEditable
        };
    }

    public async Task CheckForLock(BaseDbContext dbContext, List<string> pluginIds = null)
    {
        try
        {
            if (pluginIds == null)
            {
                IsLocked = await dbContext.EformPlugins
                    .Select(x => x.PluginId)
                    .Where(x => x.Contains(Label))
                    .AnyAsync();
            }
            else
            {
                if (!IsLocked)
                {
                    IsLocked = pluginIds.Any(x => x.Contains(Label));
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }
}
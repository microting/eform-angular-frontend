namespace ItemsGroupPlanning.Pn.Infrastructure.Models
{
    using System;
    using System.Collections.Generic;
    using Microting.ItemsGroupPlanningBase.Infrastructure.Enums;

    public class ItemsListPnModel
    {
        public int Id { get; set; }
        
        public string Name { get; set; }
        
        public string Description { get; set; }
        
        public int RepeatEvery { get; set; }
        
        public RepeatType RepeatType { get; set; }
        
        public DateTime? RepeatUntil { get; set; }
        
        public DayOfWeek? DayOfWeek { get; set; }
        
        public int? DayOfMonth { get; set; }
        
        public DateTime? LastExecutedTime { get; set; }
        
        public int RelatedEFormId { get; set; }
        
        public string RelatedEFormName { get; set; }
        
        public bool LabelEnabled { get; set; }
        
        public bool DescriptionEnabled { get; set; }
        
        public bool DeployedAtEnabled { get; set; }

        public bool DoneAtEnabled { get; set; }

        public bool DoneByUserNameEnabled { get; set; }

        public bool UploadedDataEnabled { get; set; }
        
        public bool ItemNumberEnabled { get; set; }
        
        public bool LocationCodeEnabled { get; set; }
        
        public bool BuildYearEnabled { get; set; }
        
        public bool TypeEnabled { get; set; }
        
        public bool NumberOfImagesEnabled { get; set; }
        
        public string FieldName1 { get; set; }

        public string FieldName2 { get; set; }

        public string FieldName3 { get; set; }

        public string FieldName4 { get; set; }

        public string FieldName5 { get; set; }

        public string FieldName6 { get; set; }

        public string FieldName7 { get; set; }

        public string FieldName8 { get; set; }

        public string FieldName9 { get; set; }

        public string FieldName10 { get; set; }
        
        public int? SdkFieldId1 { get; set; }
        
        public int? SdkFieldId2 { get; set; }
        
        public int? SdkFieldId3 { get; set; }
        
        public int? SdkFieldId4 { get; set; }
        
        public int? SdkFieldId5 { get; set; }
        
        public int? SdkFieldId6 { get; set; }
        
        public int? SdkFieldId7 { get; set; }
        
        public int? SdkFieldId8 { get; set; }
        
        public int? SdkFieldId9 { get; set; }
        
        public int? SdkFieldId10 { get; set; }

        public List<ItemsListPnItemModel> Items { get; set; }
            = new List<ItemsListPnItemModel>();
    }
}
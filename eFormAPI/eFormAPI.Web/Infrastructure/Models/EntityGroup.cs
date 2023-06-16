using System;
using System.Collections.Generic;
using Microting.eForm.Infrastructure.Models;

namespace eFormAPI.Web.Infrastructure.Models;

public class EntityGroup
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public string Type { get; set; }

    public string MicrotingUUID { get; set; }

    public List<EntityItem> EntityGroupItemLst { get; set; }

    public string WorkflowState { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public bool IsLocked { get; set; }

    public bool IsEditable { get; set; }

    public static implicit operator EntityGroup(Microting.eForm.Infrastructure.Models.EntityGroup entityGroup)
    {
        return new EntityGroup()
        {
            Id = entityGroup.Id,
            Name = entityGroup.Name,
            Type = entityGroup.Type,
            MicrotingUUID = entityGroup.MicrotingUUID,
            EntityGroupItemLst = entityGroup.EntityGroupItemLst,
            WorkflowState = entityGroup.WorkflowState,
            CreatedAt = entityGroup.CreatedAt,
            UpdatedAt = entityGroup.UpdatedAt,
            IsLocked = entityGroup.Locked,
            IsEditable = entityGroup.Editable,
            Description = entityGroup.Description
        };
    }
}
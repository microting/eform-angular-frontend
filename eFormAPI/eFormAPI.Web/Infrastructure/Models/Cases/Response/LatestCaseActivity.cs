using System;

namespace eFormAPI.Web.Infrastructure.Models.Cases.Response;

public class LatestCaseActivity
{
    public int Id { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int? CheckListId { get; set; }
    public string CheckListText { get; set; }
}
namespace eFormAPI.Web.Infrastructure.Models.Sites;

using System.Collections.Generic;

public class UpdateSiteTagsModel
{
    public int SiteId { get; set; }
    public List<int> TagsIds { get; set; }
}
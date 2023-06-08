namespace eFormAPI.Web.Infrastructure.Models.Sites;

using System.Collections.Generic;

public class SiteUpdateModel
{
    public int Id { get; set; }

    public string SiteName { get; set; }

    public List<int> Tags { get; set; }
        = new List<int>();
}
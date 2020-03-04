using eFormAPI.Web.Infrastructure.Models.Units;
using Microting.eForm.Dto;

namespace eFormAPI.Web.Infrastructure.Models.Sites
{
    using System;
    using System.Collections.Generic;

    public class SiteModel
    {
        public int Id { get; set; }

        public int SiteUId { get; set; }

        public string SiteName { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public List<KeyValueModel> Tags { get; set; }
            = new List<KeyValueModel>();
        
        public List<UnitModel> Units { get; set; } = new List<UnitModel>();
    }
}
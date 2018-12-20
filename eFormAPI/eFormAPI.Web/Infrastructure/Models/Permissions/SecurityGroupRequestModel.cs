namespace eFormAPI.Web.Infrastructure.Models.Permissions
{
    public class SecurityGroupRequestModel
    {
        public string Sort { get; set; }
        public string NameFilter { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public bool IsSortDsc { get; set; }
        public int Offset { get; set; }
    }
}
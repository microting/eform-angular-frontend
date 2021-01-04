namespace eFormAPI.Web.Infrastructure.Models.DeviceUsers
{
    public class DeviceUser
    {
        public int SiteId { get; set; }
        public int? SiteUid { get; set; }
        public string SiteName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? CustomerNo { get; set; }
        public int? OtpCode { get; set; }
        public int? UnitId { get; set; }
        public int? UnitUid { get; set; }
        public int? WorkerUid { get; set; }
        public int LanguageId { get; set; }
        public string Language { get; set; }
        public string LanguageCode { get; set; }
    }
}
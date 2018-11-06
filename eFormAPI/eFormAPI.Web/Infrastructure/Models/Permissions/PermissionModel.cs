namespace eFormAPI.Web.Infrastructure.Models.Permissions
{
    public class PermissionModel
    {
        public int Id { get; set; }
        public string PermissionName { get; set; }
        public string ClaimName { get; set; }
        public int PermissionTypeId { get; set; }
        public string PermissionType { get; set; }
        public bool IsEnabled { get; set; }
    }
}
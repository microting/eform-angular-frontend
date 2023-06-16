using System;

namespace eFormAPI.Web.Infrastructure.Models.Units;

public class UnitModel
{
    public int Id { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public int SiteId { get; set; }

    public int SiteMicrotingUid { get; set; }

    public string SiteName { get; set; }

    public int MicrotingUid { get; set; }

    public int? CustomerNo { get; set; }

    public int? OtpCode { get; set; }

    public string Manufacturer { get; set; }

    public string Model { get; set; }

    public string Note { get; set; }

    public string Os { get; set; }

    public string OsVersion { get; set; }

    public string eFormVersion { get; set; }

    public string InSightVersion { get; set; }

    public string eFormVersionHealth { get; set; }

    public string InSightVersionHealth { get; set; }

    public bool PushEnabled { get; set; }

    public int SyncDefaultDelay { get; set; }

    public bool SyncDelayEnabled { get; set; }

    public int SyncDelayPrCheckList { get; set; }

    public bool SyncDialog { get; set; }

    public bool IsLocked { get; set; }
}
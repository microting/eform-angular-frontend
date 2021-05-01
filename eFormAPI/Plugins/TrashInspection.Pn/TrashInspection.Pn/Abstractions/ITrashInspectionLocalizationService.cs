namespace TrashInspection.Pn.Abstractions
{
    public interface ITrashInspectionLocalizationService
    {
        string GetString(string key);
        string GetString(string format, params object[] args);
    }
}

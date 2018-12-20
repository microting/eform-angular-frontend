namespace eFormAPI.Web.Abstractions
{
    public interface ILocalizationService
    {
        string GetString(string key);
        string GetString(string format, params object[] args);
    }
}
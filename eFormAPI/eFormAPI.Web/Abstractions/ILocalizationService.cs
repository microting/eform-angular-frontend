namespace eFormAPI.Web.Abstractions
{
    public interface ILocalizationService
    {
        string GetString(string key);

        string GetStringWithFormat(string format,
           params object[] args);
    }
}
namespace Customers.Pn.Abstractions
{
    public interface ICustomersLocalizationService
    {
        string GetString(string key);
        string GetString(string format, params object[] args);
    }
}
namespace WorkOrders.Pn.Abstractions
{
    public interface IWorkOrdersLocalizationService
    {
        string GetString(string key);
        string GetString(string format, params object[] args);
    }
}

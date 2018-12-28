using Microsoft.Extensions.Configuration;

namespace eFormAPI.Web.Hosting.Settings
{
    public class EfConfigurationSource : IConfigurationSource
    {
        private readonly string _connectionString;

        public EfConfigurationSource(string connectionString)
        {
            _connectionString = connectionString;
        }

        public IConfigurationProvider Build(IConfigurationBuilder builder)
        {
            return new EfConfigurationProvider(_connectionString);
        }
    }
}
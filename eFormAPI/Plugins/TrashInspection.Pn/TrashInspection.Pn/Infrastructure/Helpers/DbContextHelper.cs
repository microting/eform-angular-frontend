using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Factories;

namespace TrashInspection.Pn.Infrastructure.Helpers
{
    public class DbContextHelper
    {
        private string ConnectionString { get;}

        public DbContextHelper(string connectionString)
        {
            ConnectionString = connectionString;
        }

        public TrashInspectionPnDbContext GetDbContext()
        {
            TrashInspectionPnContextFactory contextFactory = new TrashInspectionPnContextFactory();

            return contextFactory.CreateDbContext(new[] { ConnectionString });
        }
    }
}
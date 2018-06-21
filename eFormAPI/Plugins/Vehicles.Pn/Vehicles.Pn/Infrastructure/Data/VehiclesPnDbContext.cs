using System.Data.Entity;

namespace Vehicles.Pn.Infrastructure.Data
{
    public class VehiclesPnDbContext
    {
        // public VehiclesPnDbContext()
        //     : base("eFormMainConnection")
        // {
        //     Configuration.ProxyCreationEnabled = false;
        //     Configuration.LazyLoadingEnabled = false;
        //     Database.SetInitializer<VehiclesPnDbContext>(null);
        // }
        // 
        // public VehiclesPnDbContext(string connectionString)
        //     : base(connectionString)
        // {
        //     Configuration.ProxyCreationEnabled = false;
        //     Configuration.LazyLoadingEnabled = false;
        //     Database.SetInitializer<BaseDbContext>(null);
        // }
        // 
        // public static VehiclesPnDbContext Create()
        // {
        //     return new VehiclesPnDbContext();
        // }
        // 
        // protected override void OnModelCreating(DbModelBuilder modelBuilder)
        // {
        //     base.OnModelCreating(modelBuilder);
        //     modelBuilder.Entity<EformUser>().ToTable("Users");
        //     modelBuilder.Entity<EformRole>().ToTable("Roles");
        //     modelBuilder.Entity<EformUserRole>().ToTable("UserRoles");
        //     modelBuilder.Entity<EformUserClaim>().ToTable("UserClaims");
        //     modelBuilder.Entity<EformUserLogin>().ToTable("UserLogins");
        // }
    }
}

using System.Data.Entity;
using Customers.Pn.Infrastructure.Data.Entities;

namespace Customers.Pn.Infrastructure.Data
{
    public class CustomersPnDbContext : DbContext
    {
        public CustomersPnDbContext()
            : base("eFormCustomersPnConnection")
        {
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = false;
            Database.SetInitializer<CustomersPnDbContext>(null);
        }

        public CustomersPnDbContext(string connectionString)
            : base(connectionString)
        {
            Configuration.ProxyCreationEnabled = false;
            Configuration.LazyLoadingEnabled = false;
            Database.SetInitializer<CustomersPnDbContext>(null);
        }

        public static CustomersPnDbContext Create()
        {
            return new CustomersPnDbContext();
        }

        public DbSet<CustomerPn> Customers { get; set; }
        public DbSet<FieldPn> Fields { get; set; }
        public DbSet<CustomerFieldPn> CustomerFields { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<CustomerPn>()
            //    .Property(e => e.VinNumber)
            //    .HasColumnAnnotation(
            //        IndexAnnotation.AnnotationName,
            //        new IndexAnnotation(new IndexAttribute { IsUnique = true }));
        }
    }
}

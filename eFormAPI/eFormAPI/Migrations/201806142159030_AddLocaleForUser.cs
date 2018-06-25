namespace eFormAPI.Web.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class AddLocaleForUser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "Locale", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "Locale");
        }
    }
}

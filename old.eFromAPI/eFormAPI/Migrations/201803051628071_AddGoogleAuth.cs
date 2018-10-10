namespace eFormAPI.Web.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class AddGoogleAuth : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "IsGoogleAuthenticatorEnabled", c => c.Boolean(nullable: false));
            AddColumn("dbo.Users", "GoogleAuthenticatorSecretKey", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Users", "GoogleAuthenticatorSecretKey");
            DropColumn("dbo.Users", "IsGoogleAuthenticatorEnabled");
        }
    }
}

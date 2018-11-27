namespace eFormAPI.Web.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddSavedTags : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SavedTags",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        TagId = c.Int(nullable: false),
                        TagName = c.String(maxLength: 250),
                        EformUserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.EformUserId, cascadeDelete: true)
                .Index(t => new { t.EformUserId, t.TagId }, unique: true);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.SavedTags", "EformUserId", "dbo.Users");
            DropIndex("dbo.SavedTags", new[] { "EformUserId", "TagId" });
            DropTable("dbo.SavedTags");
        }
    }
}

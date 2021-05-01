namespace WorkOrders.Pn.Messages
{
    public class SiteAdded
    {
        public int SiteId { get; protected set; }

        public SiteAdded(int siteId)
        {
            SiteId = siteId;
        }
    }
}
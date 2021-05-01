namespace WorkOrders.Pn.Messages
{
    public class eFormCaseUpdated
    {
        public int caseId { get; protected set; }

        public eFormCaseUpdated(int caseId)
        {
            this.caseId = caseId;
        }
    }
}

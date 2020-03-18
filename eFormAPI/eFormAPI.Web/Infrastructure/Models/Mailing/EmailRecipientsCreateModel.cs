namespace eFormAPI.Web.Infrastructure.Models.Mailing
{
    using System.Collections.Generic;

    public class EmailRecipientsCreateModel
    {
        public string NewTags { get; set; }

        public List<int> TagsIds { get; set; }
            = new List<int>();

        public List<EmailRecipientCreateModel> EmailRecipientsList { get; set; }
            = new List<EmailRecipientCreateModel>();
    }
}
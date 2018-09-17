using System.Collections.Generic;

namespace eFormAPI.BasePn.Models.Cases.Request
{
    public class ReplyRequest
    {
        public int Id { get; set; }
        public string Label { get; set; }
        public List<CaseEditRequest> ElementList { get; set; }
    }
}
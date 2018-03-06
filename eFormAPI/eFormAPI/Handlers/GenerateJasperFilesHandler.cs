using eFormAPI.Web.Messages;
using System.Threading.Tasks;
using Rebus.Handlers;
using System;
using eFormCore;

namespace eFormAPI.Web.Handlers
{
    public class GenerateJasperFilesHandler : IHandleMessages<GenerateJasperFiles>
    {
        private readonly Core _core;

        public GenerateJasperFilesHandler(Core core)
        {
            _core = core;
        }

        #pragma warning disable 1998
        public async Task Handle(GenerateJasperFiles message)
        {
            int? caseId = _core.CaseReadFirstId(message.TemplateId, "not_removed");
            if (caseId != null)
            {
                _core.CaseToPdf((int)caseId, message.TemplateId.ToString(), DateTime.Now.ToString("yyyyMMddHHmmssffff"), $"{_core.GetHttpServerAddress()}/" + "api/template-files/get-image?&filename=");
            }
        }
    }
}
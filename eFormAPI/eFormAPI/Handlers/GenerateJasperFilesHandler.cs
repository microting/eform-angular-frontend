using eFormAPI.Web.Messages;
using System.Threading.Tasks;
using Rebus.Handlers;

namespace eFormAPI.Web.Handlers
{
    public class GenerateJasperFilesHandler : IHandleMessages<GenerateJasperFiles>
    {
        //private readonly SqlController sqlController;

        public GenerateJasperFilesHandler()
        {
            //this.sqlController = sqlController;
        }

#pragma warning disable 1998
        public async Task Handle(GenerateJasperFiles message)
        {
            //sqlController.NotificationCreate(message.NotificationId, message.MicrotringUUID, Constants.Notifications.UnitActivate);

            // Potentially send new message onto local queue
        }
    }
}
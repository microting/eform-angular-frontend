using System;
using System.Web.Http;
using eFormCore;
using eFromAPI.Common.API;
using eFromAPI.Common.Models;

namespace eFormAPI.Web.Controllers
{
    public class SettingsController : ApiController
    {
        [HttpPost]
        public OperationResult ConnectionString(ConnectionStringModel connectionStringModel)
        {
            if (!ModelState.IsValid) return new OperationResult(false, "Required fields are not filled");

            AdminTools adminTools;
            string result = "Data Source="
                            + connectionStringModel.Source + ";Initial Catalog="
                            + connectionStringModel.Catalogue + ";"
                            + connectionStringModel.Auth;

            try
            {
                System.IO.File.AppendAllText(System.Web.Hosting.HostingEnvironment.MapPath("~/bin/Input.txt"),
                    result);
            }
            catch (Exception)
            {
                return new OperationResult(false, "Could not write connection string in /bin/Input.txt");
            }


            try
            {
                adminTools = new AdminTools(result);
            }
            catch
            {
                return new OperationResult(false, "Connection string is invalid");
            }

            adminTools.DbSetup(connectionStringModel.Token);

            return new OperationResult(true);
        }
    }
}
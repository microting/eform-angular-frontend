using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using eFormAPI.Web.Helpers;
using eFormCore;
using eFormShared;
using eFromAPI.Common.API;
using eFromAPI.Common.Models;

namespace eFormAPI.Web.Controllers
{
    public class TemplatesController : ApiController
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

        [HttpGet]
        public OperationDataResult<List<Template_Dto>> Index()
        {
            try
            {
                try
                {
                    Core core = _coreHelper.GetCore();
                    var templatesDto = core.TemplateItemReadAll(false);
                    return new OperationDataResult<List<Template_Dto>>(true, templatesDto);
                }
                catch (Exception ex)
                {
                    if (ex.Message.Contains("PrimeDb"))
                    {
                        string[] lines =
                            System.IO.File.ReadAllLines(
                                System.Web.Hosting.HostingEnvironment.MapPath("~/bin/Input.txt"));

                        string connectionStr = lines.First();
                        AdminTools adminTool = new AdminTools(connectionStr, false);
                        adminTool.DbSettingsReloadRemote();
                        return new OperationDataResult<List<Template_Dto>>(false, "Check connection string");
                    }
                    else
                    {
                        if (ex.InnerException.Message.Contains("Cannot open database"))
                        {
                            try
                            {
                                Core core = _coreHelper.GetCore();
                            }
                            catch (Exception ex2)
                            {
                                return new OperationDataResult<List<Template_Dto>>(false, "Core is not started.");
                            }
                            return new OperationDataResult<List<Template_Dto>>(false, "Check settings before proceed");
                        }
                    }
                    return new OperationDataResult<List<Template_Dto>>(false, "Check settings before proceed");
                }
            }
            catch (Exception)
            {
                return new OperationDataResult<List<Template_Dto>>(false, "Connection is missing");
            }
        }


        [HttpPost]
        public OperationResult Create(EFormXmlModel eFormXmlModel)
        {
            Core core = _coreHelper.GetCore();

            var newTemplate = core.TemplateFromXml(eFormXmlModel.EFormXml);

            newTemplate = core.TemplateUploadData(newTemplate);
            List<string> errors = core.TemplateValidation(newTemplate);

            if (!errors.Any())
            {
                if (newTemplate == null) return new OperationResult(false, "eForm could not be created!");

                core.TemplateCreate(newTemplate);
                return new OperationResult(true, $"eForm \"{newTemplate.Label}\" created successfully");
            }

            string message = errors.Aggregate("", (current, str) => current + ("<br>" + str));

            return new OperationResult(false, "eForm could not be created!" + message);
        }

        [HttpGet]
        public OperationResult Delete(int id)
        {
            Core core = _coreHelper.GetCore();
            var templateDto = core.TemplateItemRead(id);
            try
            {
                return core.TemplateDelete(id)
                    ? new OperationResult(true, $"eForm \"{templateDto.Label}\" deleted successfully")
                    : new OperationResult(false, $"eForm \"{templateDto.Label}\" could not be deleted!");
            }
            catch (Exception)
            {
                return new OperationResult(false, $"eForm \"{templateDto.Label}\" could not be deleted!");
            }
        }

        [HttpPost]
        public OperationDataResult<DeployToModel> DeployTo(int id)
        {
            Core core = _coreHelper.GetCore();
            var templateDto = core.TemplateItemRead(id);
            var siteNamesDto = core.Advanced_SiteItemReadAll();

            var deployToMode = new DeployToModel()
            {
                SiteNamesDto = siteNamesDto,
                TemplateDto = templateDto
            };
            return new OperationDataResult<DeployToModel>(true, deployToMode);
        }

        [HttpPost]
        public OperationResult Deploy(DeployModel deployModel)
        {
            List<int> deployedSiteIds = new List<int>();

            List<int> sitesToBeRetractedFrom = new List<int>();
            List<int> sitesToBeDeployedTo = new List<int>();

            Core core = _coreHelper.GetCore();
            var templateDto = core.TemplateItemRead(deployModel.Id);

            foreach (var site in templateDto.DeployedSites)
            {
                deployedSiteIds.Add(site.SiteUId);
            }

            List<int> requestedSiteIds = deployModel
                .DeployCheckboxes
                .Select(deployCheckbox => deployCheckbox.Id)
                .ToList();

            if (requestedSiteIds.Count == 0)
            {
                sitesToBeRetractedFrom.AddRange(templateDto.DeployedSites.Select(site => site.SiteUId));
            }
            else
            {
                sitesToBeDeployedTo.AddRange(requestedSiteIds.Where(siteId => !deployedSiteIds.Contains(siteId)));
            }

            if (deployedSiteIds.Count != 0)
            {
                foreach (var site in templateDto.DeployedSites)
                {
                    if (!requestedSiteIds.Contains(site.SiteUId))
                    {
                        if (!sitesToBeRetractedFrom.Contains(site.SiteUId))
                        {
                            sitesToBeRetractedFrom.Add(site.SiteUId);
                        }
                    }
                }
            }

            if (sitesToBeDeployedTo.Any())
            {
                var mainElement = core.TemplateRead(deployModel.Id);
                mainElement.Repeated =
                    0; // We set this right now hardcoded, this will let the eForm be deployed until end date or we actively retract it.
                mainElement.EndDate = DateTime.Now.AddYears(10);
                mainElement.StartDate = DateTime.Now;
                core.CaseCreate(mainElement, "", sitesToBeDeployedTo, "");
            }

            foreach (var siteUId in sitesToBeRetractedFrom)
            {
                core.CaseDelete(deployModel.Id, siteUId);
            }

            return new OperationResult(true, $"eForm \"{templateDto.Label}\" deployed successfully!");
        }

        [HttpGet]
        public HttpResponseMessage Csv(int id)
        {
            Core core = _coreHelper.GetCore();

            string fileName = $"{id}_{DateTime.Now.Ticks}.csv";
            System.IO.Directory.CreateDirectory(System.Web.Hosting.HostingEnvironment.MapPath("~/bin/output/"));
            string filePath = System.Web.Hosting.HostingEnvironment.MapPath($"~/bin/output/{fileName}");
            var fullPath = core.CasesToCsv(id, null, null, filePath,
                $"{Request.RequestUri.Scheme}://{Request.RequestUri.Authority}{Url.Content("~")}" +
                "output/dataFolder/");

            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            var fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);

            result.Content = new StreamContent(fileStream);
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            result.Content.Headers.ContentDisposition.FileName = fileName;
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/octet-stream");
            return result;
        }

        [HttpGet]
        public HttpResponseMessage GetImage(string fileName)
        {
            string filePath = HttpContext.Current.Server.MapPath($"~/output/datafolder/picture/{fileName}");
            if (!File.Exists(filePath))
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
            var extention = Path.GetExtension(filePath).Replace(".", "");

            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

            result.Content = new StreamContent(fileStream);
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            result.Content.Headers.ContentDisposition.FileName = fileName;
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue($"image/{extention}");
            return result;
        }
    }
}
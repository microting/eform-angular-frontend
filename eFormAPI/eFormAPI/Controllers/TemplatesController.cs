using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using eFormAPI.Common.API;
using eFormAPI.Common.Models;
using eFormAPI.Web.Infrastructure.Helpers;
using eFormCore;
using eFormShared;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
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
                    var core = _coreHelper.GetCore();
                    var templatesDto = core.TemplateItemReadAll(false);
                    return new OperationDataResult<List<Template_Dto>>(true, templatesDto);
                }
                catch (Exception ex)
                {
                    if (ex.Message.Contains("PrimeDb"))
                    {
                        var lines =
                            System.IO.File.ReadAllLines(
                                System.Web.Hosting.HostingEnvironment.MapPath("~/bin/Input.txt"));

                        var connectionStr = lines.First();
                        var adminTool = new AdminTools(connectionStr);
                        adminTool.DbSettingsReloadRemote();
                        return new OperationDataResult<List<Template_Dto>>(false, "Check connection string");
                    }
                    else
                    {
                        if (ex.InnerException.Message.Contains("Cannot open database"))
                        {
                            try
                            {
                                var core = _coreHelper.GetCore();
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
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }
        }

        [HttpGet]
        public OperationDataResult<Template_Dto> Get(int id)
        {
            try
            {
                try
                {
                    var core = _coreHelper.GetCore();
                    var templateDto = core.TemplateItemRead(id);
                    return new OperationDataResult<Template_Dto>(true, templateDto);
                }
                catch (Exception ex)
                {
                    if (ex.Message.Contains("PrimeDb"))
                    {
                        var lines =
                            System.IO.File.ReadAllLines(
                                System.Web.Hosting.HostingEnvironment.MapPath("~/bin/Input.txt"));

                        var connectionStr = lines.First();
                        var adminTool = new AdminTools(connectionStr);
                        adminTool.DbSettingsReloadRemote();
                        return new OperationDataResult<Template_Dto>(false, "Check connection string");
                    }
                    else
                    {
                        if (ex.InnerException.Message.Contains("Cannot open database"))
                        {
                            try
                            {
                                var core = _coreHelper.GetCore();
                            }
                            catch (Exception ex2)
                            {
                                return new OperationDataResult<Template_Dto>(false, "Core is not started.");
                            }
                            return new OperationDataResult<Template_Dto>(false, "Check settings before proceed");
                        }
                    }
                    return new OperationDataResult<Template_Dto>(false, "Check settings before proceed");
                }
            }
            catch (Exception)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }
        }


        [HttpPost]
        public OperationResult Create(EFormXmlModel eFormXmlModel)
        {
            var core = _coreHelper.GetCore();

            var newTemplate = core.TemplateFromXml(eFormXmlModel.EFormXml);

            newTemplate = core.TemplateUploadData(newTemplate);
            var errors = core.TemplateValidation(newTemplate);

            if (!errors.Any())
            {
                if (newTemplate == null) return new OperationResult(false, "eForm could not be created!");

                core.TemplateCreate(newTemplate);
                return new OperationResult(true, $"eForm \"{newTemplate.Label}\" created successfully");
            }

            var message = errors.Aggregate("", (current, str) => current + ("<br>" + str));

            return new OperationResult(false, "eForm could not be created!" + message);
        }

        [HttpGet]
        public OperationResult Delete(int id)
        {
            var core = _coreHelper.GetCore();
            var templateDto = core.TemplateItemRead(id);
            foreach (var siteUId in templateDto.DeployedSites)
            {
                core.CaseDelete(templateDto.Id, siteUId.SiteUId);
            }
            var result = core.TemplateDelete(id);
            
            try
            {
                return result
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
            var core = _coreHelper.GetCore();
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
            var deployedSiteIds = new List<int>();

            var sitesToBeRetractedFrom = new List<int>();
            var sitesToBeDeployedTo = new List<int>();

            var core = _coreHelper.GetCore();
            var templateDto = core.TemplateItemRead(deployModel.Id);

            foreach (var site in templateDto.DeployedSites)
            {
                deployedSiteIds.Add(site.SiteUId);
            }

            var requestedSiteIds = deployModel
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

            return new OperationResult(true, $"\"{templateDto.Label}\" paired successfully.");
        }

        [HttpGet]
        public HttpResponseMessage Csv(int id)
        {
            var core = _coreHelper.GetCore();

            var fileName = $"{id}_{DateTime.Now.Ticks}.csv";
            System.IO.Directory.CreateDirectory(System.Web.Hosting.HostingEnvironment.MapPath("~/bin/output/"));
            var filePath = System.Web.Hosting.HostingEnvironment.MapPath($"~/bin/output/{fileName}");
            var fullPath = core.CasesToCsv(id, null, null, filePath,
                $"{Request.RequestUri.Scheme}://{Request.RequestUri.Authority}{Url.Content("~")}" +
                "output/dataFolder/");

            var result = new HttpResponseMessage(HttpStatusCode.OK);
            var fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);

            result.Content = new StreamContent(fileStream);
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            result.Content.Headers.ContentDisposition.FileName = fileName;
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue("application/octet-stream");
            return result;
        }

        [HttpGet]
        [Authorize]
        public HttpResponseMessage GetImage(string fileName, string noCache = "noCache")
        {
            var filePath = HttpContext.Current.Server.MapPath($"~/output/datafolder/picture/{fileName}");
            if (!File.Exists(filePath))
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
            var extention = Path.GetExtension(filePath).Replace(".", "");

            var result = new HttpResponseMessage(HttpStatusCode.OK);
            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

            result.Content = new StreamContent(fileStream);
            result.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment") {FileName = fileName};
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue($"image/{extention}");
            return result;
        }

        [HttpGet]
        [Authorize]
        public OperationResult RotateImage(string fileName)
        {
            var filePath = HttpContext.Current.Server.MapPath($"~/output/datafolder/picture/{fileName}");
            if (!File.Exists(filePath))
            {
                return new OperationResult(false, "File not found");
            }
        
            var img = Image.FromFile(filePath);
            img.RotateFlip(RotateFlipType.Rotate90FlipNone);
            img.Save(filePath);
            img.Dispose();

            return new OperationResult(true, "Image rotated successfully.");
        }

        [HttpGet]
        [Authorize]
        public OperationResult DeleteImage(string fileName, int fieldId, int uploadedObjId)
        {
            try
            {
                var core = _coreHelper.GetCore();
                if (!core.Advanced_DeleteUploadedData(fieldId, uploadedObjId))
                {
                    return new OperationResult(false, "Error: Image was not deleted");
                }
            }

            catch (Exception e)
            {
                Console.WriteLine(e);
                return new OperationResult(false, "Error");
            }
            return new OperationResult(true, "Image deleted successfully.");
        }


        [HttpGet]
        [Authorize]
        public HttpResponseMessage GetPdfFile(string fileName)
        {
            var filePath = HttpContext.Current.Server.MapPath($"~/output/datafolder/pdf/{fileName}.pdf");
            if (!File.Exists(filePath))
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }

            var result = new HttpResponseMessage(HttpStatusCode.OK);
            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

            result.Content = new StreamContent(fileStream);
            result.Content.Headers.ContentDisposition =
                new ContentDispositionHeaderValue("attachment") {FileName = fileName};
            result.Content.Headers.ContentType =
                new MediaTypeHeaderValue($"application/pdf");
            return result;
        }
    }
}
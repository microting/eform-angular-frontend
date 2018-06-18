using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Helpers;
using eFormAPI.Web.Infrastructure.Models;
using eFormAPI.Web.Infrastructure.Models.API;
using eFormAPI.Web.Infrastructure.Models.Templates;
using eFormCore;
using eFormShared;
using EformBase.Pn.Infrastructure;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class TemplatesController : ApiController
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

        [HttpPost]
        public OperationDataResult<TemplateListModel> Index(TemplateRequestModel templateRequestModel)
        {
            try
            {
                try
                {
                    var core = _coreHelper.GetCore();
                    var templatesDto = core.TemplateItemReadAll(false,
                        "",
                        templateRequestModel.NameFilter,
                        templateRequestModel.IsSortDsc,
                        templateRequestModel.Sort,
                        templateRequestModel.TagIds);

                    var model = new TemplateListModel
                    {
                        NumOfElements = 40,
                        PageNum = templateRequestModel.PageIndex,
                        Templates = templatesDto
                    };


                    return new OperationDataResult<TemplateListModel>(true, model);
                }
                catch (Exception ex)
                {
                    if (ex.Message.Contains("PrimeDb"))
                    {
                        var lines = File.ReadAllLines(
                            System.Web.Hosting.HostingEnvironment.MapPath("~/bin/Input.txt"));

                        var connectionStr = lines.First();
                        var adminTool = new AdminTools(connectionStr);
                        adminTool.DbSettingsReloadRemote();
                        return new OperationDataResult<TemplateListModel>(false, LocaleHelper.GetString("CheckConnectionString"));
                    }
                    else
                    {
                        if (ex.InnerException.Message.Contains("Cannot open database"))
                        {
                            try
                            {
                                var core = _coreHelper.GetCore();
                            }
                            catch (Exception)
                            {
                                return new OperationDataResult<TemplateListModel>(false, LocaleHelper.GetString("CoreIsNotStarted"));
                            }
                            return new OperationDataResult<TemplateListModel>(false, LocaleHelper.GetString("CheckSettingsBeforeProceed"));
                        }
                    }
                    return new OperationDataResult<TemplateListModel>(false, LocaleHelper.GetString("CheckSettingsBeforeProceed"));
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
                        var lines = File.ReadAllLines(System.Web.Hosting.HostingEnvironment.MapPath("~/bin/Input.txt"));

                        var connectionStr = lines.First();
                        var adminTool = new AdminTools(connectionStr);
                        adminTool.DbSettingsReloadRemote();
                        return new OperationDataResult<Template_Dto>(false, LocaleHelper.GetString("CheckConnectionString"));
                    }
                    else
                    {
                        if (ex.InnerException.Message.Contains("Cannot open database"))
                        {
                            try
                            {
                                var core = _coreHelper.GetCore();
                            }
                            catch (Exception)
                            {
                                return new OperationDataResult<Template_Dto>(false, LocaleHelper.GetString("CoreIsNotStarted"));
                            }
                            return new OperationDataResult<Template_Dto>(false, LocaleHelper.GetString("CheckSettingsBeforeProceed"));
                        }
                    }
                    return new OperationDataResult<Template_Dto>(false, LocaleHelper.GetString("CheckSettingsBeforeProceed"));
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
            try
            {
                var core = _coreHelper.GetCore();
                // Create tags
                if (eFormXmlModel.NewTag != null)
                {
                    var tagList = eFormXmlModel.NewTag.Replace(" ", "").Split(',');
                    foreach (var tag in tagList)
                    {
                        eFormXmlModel.TagIds.Add(core.TagCreate(tag));
                    }
                }
                // Create eform
                var newTemplate = core.TemplateFromXml(eFormXmlModel.EFormXml);
                newTemplate = core.TemplateUploadData(newTemplate);
                // Check errors
                var errors = core.TemplateValidation(newTemplate);
                if (errors.Any())
                {
                    var message = errors.Aggregate("", (current, str) => current + ("<br>" + str));
                    throw new Exception(LocaleHelper.GetString("eFormCouldNotBeCreated") + message);
                }
                if (newTemplate == null) throw new Exception(LocaleHelper.GetString("eFormCouldNotBeCreated"));
                // Set tags to eform
                core.TemplateCreate(newTemplate);
                if (eFormXmlModel.TagIds != null)
                {
                    core.TemplateSetTags(newTemplate.Id, eFormXmlModel.TagIds);
                }
                return new OperationResult(true, LocaleHelper.GetString("eFormParamCreatedSuccessfully", newTemplate.Label));
            }
            catch (Exception e)
            {
                return new OperationResult(false, e.Message);
            }
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
                    ? new OperationResult(true, LocaleHelper.GetString("eFormParamDeletedSuccessfully", templateDto.Label))
                    : new OperationResult(false, LocaleHelper.GetString("eFormParamCouldNotBeDeleted", templateDto.Label));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("eFormParamCouldNotBeDeleted", id));
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
                mainElement.EndDate = DateTime.Now.AddYears(10).ToUniversalTime();
                mainElement.StartDate = DateTime.Now.ToUniversalTime();
                core.CaseCreate(mainElement, "", sitesToBeDeployedTo, "");
            }

            foreach (var siteUId in sitesToBeRetractedFrom)
            {
                core.CaseDelete(deployModel.Id, siteUId);
            }

            return new OperationResult(true, LocaleHelper.GetString("ParamPairedSuccessfully", templateDto.Label));
        }

        //[HttpGet]
        //public HttpResponseMessage Csv(int id)
        //{
        //    var core = _coreHelper.GetCore();
        //    var fileName = $"{id}_{DateTime.Now.Ticks}.csv";
        //    Directory.CreateDirectory(System.Web.Hosting.HostingEnvironment.MapPath("~/bin/output/"));
        //    var filePath = System.Web.Hosting.HostingEnvironment.MapPath($"~/bin/output/{fileName}");
        //    var fullPath = core.CasesToCsv(id, null, null, filePath,
        //        $"{Request.RequestUri.Scheme}://{Request.RequestUri.Authority}/api/templates/getimage?&filename=");

        //    var result = new HttpResponseMessage(HttpStatusCode.OK);
        //    var fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read);

        //    result.Content = new StreamContent(fileStream);
        //    result.Content.Headers.ContentDisposition =
        //        new ContentDispositionHeaderValue("attachment") {FileName = fileName};
        //    result.Content.Headers.ContentType =
        //        new MediaTypeHeaderValue("application/octet-stream");
        //    return result;
        //}

        //[HttpGet]
        //[Authorize]
        //public HttpResponseMessage GetImage(string fileName, string noCache = "noCache")
        //{
        //    var filePath = HttpContext.Current.Server.MapPath($"~/output/datafolder/picture/{fileName}");
        //    if (!File.Exists(filePath))
        //    {
        //        return new HttpResponseMessage(HttpStatusCode.NotFound);
        //    }
        //    var extention = Path.GetExtension(filePath).Replace(".", "");

        //    var result = new HttpResponseMessage(HttpStatusCode.OK);
        //    var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

        //    result.Content = new StreamContent(fileStream);
        //    result.Content.Headers.ContentDisposition =
        //        new ContentDispositionHeaderValue("attachment") {FileName = fileName};
        //    result.Content.Headers.ContentType =
        //        new MediaTypeHeaderValue($"image/{extention}");
        //    return result;
        //}

        //[HttpGet]
        //[Authorize]
        //public OperationResult RotateImage(string fileName)
        //{
        //    var filePath = HttpContext.Current.Server.MapPath($"~/output/datafolder/picture/{fileName}");
        //    if (!File.Exists(filePath))
        //    {
        //        return new OperationResult(false, "File not found");
        //    }

        //    var img = Image.FromFile(filePath);
        //    img.RotateFlip(RotateFlipType.Rotate90FlipNone);
        //    img.Save(filePath);
        //    img.Dispose();

        //    return new OperationResult(true, "Image rotated successfully.");
        //}

        //[HttpGet]
        //[Authorize]
        //public OperationResult DeleteImage(string fileName, int fieldId, int uploadedObjId)
        //{
        //    try
        //    {
        //        var core = _coreHelper.GetCore();
        //        if (!core.Advanced_DeleteUploadedData(fieldId, uploadedObjId))
        //        {
        //            return new OperationResult(false, "Error: Image was not deleted");
        //        }
        //    }

        //    catch (Exception e)
        //    {
        //        Console.WriteLine(e);
        //        return new OperationResult(false, "Error");
        //    }
        //    return new OperationResult(true, "Image deleted successfully.");
        //}


        //[HttpGet]
        //[Authorize]
        //public HttpResponseMessage GetPdfFile(string fileName)
        //{
        //    var filePath = HttpContext.Current.Server.MapPath($"~/output/datafolder/pdf/{fileName}.pdf");
        //    if (!File.Exists(filePath))
        //    {
        //        return new HttpResponseMessage(HttpStatusCode.NotFound);
        //    }

        //    var result = new HttpResponseMessage(HttpStatusCode.OK);
        //    var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

        //    result.Content = new StreamContent(fileStream);
        //    result.Content.Headers.ContentDisposition =
        //        new ContentDispositionHeaderValue("attachment") {FileName = fileName};
        //    result.Content.Headers.ContentType =
        //        new MediaTypeHeaderValue("application/pdf");
        //    return result;
        //}

        //[HttpGet]
        //[Authorize]
        //[Route("api/templates/download-eform-pdf/{templateId}")]
        //public HttpResponseMessage DownloadEFormPDF(int templateId)
        //{
        //    try
        //    {
        //        var core = _coreHelper.GetCore();
        //        var filePath = core.CaseToPdf(templateId, "", DateTime.Now.ToString("yyyyMMddHHmmssffff"), $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image?&filename=");
        //        if (!File.Exists(filePath))
        //        {
        //            return new HttpResponseMessage(HttpStatusCode.NotFound);
        //        }

        //        var result = new HttpResponseMessage(HttpStatusCode.OK);
        //        var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

        //        result.Content = new StreamContent(fileStream);
        //        result.Content.Headers.ContentDisposition =
        //            new ContentDispositionHeaderValue("attachment") {FileName = ""}; // TODO: FIX
        //        result.Content.Headers.ContentType =
        //            new MediaTypeHeaderValue("application/pdf");
        //        return result;
        //    }
        //    catch (Exception)
        //    {
        //        return new HttpResponseMessage(HttpStatusCode.InternalServerError);
        //    }
        //}

        //[HttpGet]
        //[Authorize]
        //[Route("api/templates/download-eform-xml/{templateId}")]
        //public HttpResponseMessage DownloadEFormXML(int templateId)
        //{
        //    try
        //    {
        //        var core = _coreHelper.GetCore();
        //        var filePath = core.CaseToJasperXml(templateId, DateTime.Now.ToString("yyyyMMddHHmmssffff"), $"{core.GetHttpServerAddress()}/" + "api/template-files/get-image?&filename=");
        //        if (!File.Exists(filePath))
        //        {
        //            return new HttpResponseMessage(HttpStatusCode.NotFound);
        //        }

        //        var result = new HttpResponseMessage(HttpStatusCode.OK);
        //        var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);

        //        result.Content = new StreamContent(fileStream);
        //        result.Content.Headers.ContentDisposition =
        //            new ContentDispositionHeaderValue("attachment") {FileName = ""}; // TODO: FIX
        //        result.Content.Headers.ContentType =
        //            new MediaTypeHeaderValue("application/pdf");
        //        return result;
        //    }
        //    catch (Exception)
        //    {
        //        return new HttpResponseMessage(HttpStatusCode.InternalServerError);
        //    }
        //}
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Models;
using eFormAPI.Web.Infrastructure.Models.Templates;
using eFormCore;
using eFormShared;
using Microsoft.EntityFrameworkCore;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microsoft.Extensions.Options;
using Microting.eFormApi.BasePn.Infrastructure.Models;

namespace eFormAPI.Web.Services
{
    public class TemplatesService : ITemplatesService
    {
        private readonly IOptions<ConnectionStringsSdk> _connectionStringsSdk;
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;
        private readonly IUserService _userService;
        private readonly BaseDbContext _dbContext;

        public TemplatesService(
            IEFormCoreService coreHelper,
            ILocalizationService localizationService,
            IUserService userService, BaseDbContext dbContext,
            IOptions<ConnectionStringsSdk> connectionStringsSdk)
        {
            _coreHelper = coreHelper;
            _localizationService = localizationService;
            _userService = userService;
            _dbContext = dbContext;
            _connectionStringsSdk = connectionStringsSdk;
        }

        public async Task<OperationDataResult<TemplateListModel>> Index(TemplateRequestModel templateRequestModel)
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
                    Templates = new List<Template_Dto>()
                };

                var eformIds = new List<int>();
                if (!_userService.IsInRole(EformRole.Admin))
                {
                    var isEformsInGroups = await _dbContext.SecurityGroupUsers
                        .Where(x => x.EformUserId == _userService.UserId)
                        .Where(x => x.SecurityGroup.EformsInGroup.Any())
                        .AnyAsync();
                    if (isEformsInGroups)
                    {
                        eformIds = _dbContext.EformInGroups
                            .Where(x =>
                                x.SecurityGroup.SecurityGroupUsers.Any(y => y.EformUserId == _userService.UserId))
                            .Select(x => x.TemplateId)
                            .ToList();

                        foreach (var templateDto in templatesDto)
                        {
                            if (eformIds.Contains(templateDto.Id))
                            {
                                model.Templates.Add(templateDto);
                            }
                        }
                    }
                    else
                    {
                        foreach (var templateDto in templatesDto)
                        {
                            model.Templates.Add(templateDto);
                        }
                    }

                }
                else
                {
                    model.Templates = templatesDto;
                }
                return new OperationDataResult<TemplateListModel>(true, model);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("PrimeDb"))
                {
                    var sdkConnectionString = _connectionStringsSdk.Value.SdkConnection;
                    var adminTool = new AdminTools(sdkConnectionString);
                    adminTool.DbSettingsReloadRemote();
                    return new OperationDataResult<TemplateListModel>(false,
                        _localizationService.GetString("CheckConnectionString"));
                }

                if (ex.InnerException.Message.Contains("Cannot open database"))
                {
                    try
                    {
                        var core = _coreHelper.GetCore();
                    }
                    catch (Exception)
                    {
                        return new OperationDataResult<TemplateListModel>(false,
                            _localizationService.GetString("CoreIsNotStarted"));
                    }

                    return new OperationDataResult<TemplateListModel>(false,
                        _localizationService.GetString("CheckSettingsBeforeProceed"));
                }

                return new OperationDataResult<TemplateListModel>(false,
                    _localizationService.GetString("CheckSettingsBeforeProceed"));
            }
        }

        public OperationDataResult<Template_Dto> Get(int id)
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
                    var sdkConnectionString = _connectionStringsSdk.Value.SdkConnection;
                    var adminTool = new AdminTools(sdkConnectionString);
                    adminTool.DbSettingsReloadRemote();
                    return new OperationDataResult<Template_Dto>(false,
                        _localizationService.GetString("CheckConnectionString"));
                }

                if (ex.InnerException.Message.Contains("Cannot open database"))
                {
                    try
                    {
                        var core = _coreHelper.GetCore();
                    }
                    catch (Exception)
                    {
                        return new OperationDataResult<Template_Dto>(false,
                            _localizationService.GetString("CoreIsNotStarted"));
                    }

                    return new OperationDataResult<Template_Dto>(false,
                        _localizationService.GetString("CheckSettingsBeforeProceed"));
                }

                return new OperationDataResult<Template_Dto>(false,
                    _localizationService.GetString("CheckSettingsBeforeProceed"));
            }
        }


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
                    throw new Exception(_localizationService.GetString("eFormCouldNotBeCreated") + message);
                }

                if (newTemplate == null) throw new Exception(_localizationService.GetString("eFormCouldNotBeCreated"));
                // Set tags to eform
                core.TemplateCreate(newTemplate);
                if (eFormXmlModel.TagIds != null)
                {
                    core.TemplateSetTags(newTemplate.Id, eFormXmlModel.TagIds);
                }

                return new OperationResult(true,
                    _localizationService.GetStringWithFormat("eFormParamCreatedSuccessfully", newTemplate.Label));
            }
            catch (Exception e)
            {
                return new OperationResult(false, e.Message);
            }
        }

        public OperationResult Delete(int id)
        {
            var core = _coreHelper.GetCore();
            var templateDto = core.TemplateItemRead(id);
            foreach (var siteUId in templateDto.DeployedSites)
            {
                core.CaseDelete(templateDto.Id, siteUId.SiteUId);
            }

            var result = core.TemplateDelete(id);

            if (result)
            {
                var eformReport = _dbContext.EformReports
                    .FirstOrDefault(x => x.TemplateId == id);

                if (eformReport != null)
                {
                    _dbContext.EformReports.Remove(eformReport);
                    _dbContext.SaveChanges();
                }
            }

            try
            {
                return result
                    ? new OperationResult(true,
                        _localizationService.GetStringWithFormat("eFormParamDeletedSuccessfully", templateDto.Label))
                    : new OperationResult(false,
                        _localizationService.GetStringWithFormat("eFormParamCouldNotBeDeleted", templateDto.Label));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetStringWithFormat("eFormParamCouldNotBeDeleted", id));
            }
        }

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

            return new OperationResult(true,
                _localizationService.GetStringWithFormat("ParamPairedSuccessfully", templateDto.Label));
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
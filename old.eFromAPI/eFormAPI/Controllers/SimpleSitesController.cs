using System;
using System.Collections.Generic;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Models;
using eFormCore;
using eFormShared;
using eFormApi.BasePn.Infrastructure;
using eFormApi.BasePn.Infrastructure.Helpers;
using eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class SimpleSitesController : ApiController
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

        [HttpGet]
        public OperationDataResult<List<Site_Dto>> Index()
        {
            Core core = _coreHelper.GetCore();
            var siteDto = core.SiteReadAll(false);
            return new OperationDataResult<List<Site_Dto>>(true, siteDto);
        }

        [HttpPost]
        public OperationResult Create(SimpleSiteModel simpleSiteModel)
        {
            if (!ModelState.IsValid) return new OperationResult(false, LocaleHelper.GetString("DeviceUserCouldNotBeCreated"));

            Core core = _coreHelper.GetCore();
            string siteName = simpleSiteModel.UserFirstName + " " + simpleSiteModel.UserLastName;

            try
            {
                var siteDto = core.SiteCreate(siteName, simpleSiteModel.UserFirstName, simpleSiteModel.UserLastName, null);

                return siteDto != null
                    ? new OperationResult(true, LocaleHelper.GetString("DeviceUserParamCreatedSuccessfully", siteDto.SiteName))
                    : new OperationResult(false, LocaleHelper.GetString("DeviceUserCouldNotBeCreated"));

            }
            catch (Exception ex)
            {
                try
                {
                    if (ex.InnerException.Message == "The remote server returned an error: (402) Payment Required.")
                    {
                        return new OperationResult(false, LocaleHelper.GetString("YouNeedToBuyMoreLicenses"));
                    }
                    else
                    {
                        return new OperationResult(false, LocaleHelper.GetString("DeviceUserCouldNotBeCreated"));
                    }
                }
                catch
                {
                    return new OperationResult(false, LocaleHelper.GetString("DeviceUserCouldNotBeCreated"));
                }

            }
        }

        [HttpGet]
        public OperationDataResult<Site_Dto> Edit(int id)
        {
            Core core = _coreHelper.GetCore();
            var siteDto = core.SiteRead(id);

            return siteDto != null
                ? new OperationDataResult<Site_Dto>(true, siteDto)
                : new OperationDataResult<Site_Dto>(false, LocaleHelper.GetString("DeviceUserParamCouldNotBeEdited", id));
        }

        [HttpPost]
        public OperationResult Update(SimpleSiteModel simpleSiteModel)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                var siteDto = core.SiteRead(simpleSiteModel.Id);
                if (siteDto.WorkerUid != null)
                {
                    var workerDto = core.Advanced_WorkerRead((int) siteDto.WorkerUid);
                    if (workerDto != null)
                    {
                        string fullName = simpleSiteModel.UserFirstName + " " + simpleSiteModel.UserLastName;
                        var isUpdated = core.SiteUpdate(simpleSiteModel.Id, fullName, simpleSiteModel.UserFirstName,
                            simpleSiteModel.UserLastName, workerDto.Email);

                        return isUpdated
                            ? new OperationResult(true, LocaleHelper.GetString("DeviceUserUpdatedSuccessfully"))
                            : new OperationResult(false,
                                LocaleHelper.GetString("DeviceUserParamCouldNotBeUpdated", simpleSiteModel.Id));
                    }
                    return new OperationResult(false, LocaleHelper.GetString("DeviceUserCouldNotBeObtained"));
                }
                return new OperationResult(false, LocaleHelper.GetString("DeviceUserNotFound"));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("DeviceUserCouldNotBeUpdated"));
            }
        }

        [HttpGet]
        public OperationResult Delete(int id)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                var siteNameDto = core.Advanced_SiteItemRead(id);

                return core.SiteDelete(siteNameDto.SiteUId)
                    ? new OperationResult(true, LocaleHelper.GetString("DeviceUserParamDeletedSuccessfully", siteNameDto.SiteName))
                    : new OperationResult(false, LocaleHelper.GetString("DeviceUserParamCouldNotBeDeleted", siteNameDto.SiteName));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("DeviceUserParamCouldNotBeDeleted", id));
            }
        }
    }
}
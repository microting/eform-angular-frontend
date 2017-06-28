using System;
using System.Collections.Generic;
using System.Web.Http;
using eFormAPI.Web.Helpers;
using eFormCore;
using eFormShared;
using eFromAPI.Common.API;
using eFromAPI.Common.Models;

namespace eFormAPI.Web.Controllers
{
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
            if (!ModelState.IsValid) return new OperationResult(false, "Worker could not be created!");

            Core core = _coreHelper.GetCore();
            string siteName = simpleSiteModel.UserFirstName + " " + simpleSiteModel.UserLastName;

            var siteDto = core.SiteCreate(siteName, simpleSiteModel.UserFirstName, simpleSiteModel.UserLastName, null);

            return siteDto != null
                ? new OperationResult(true, $"Worker \"{siteDto.SiteName}\" created successfully")
                : new OperationResult(false, "Worker could not be created!");
        }

        [HttpGet]
        public OperationDataResult<Site_Dto> Edit(int id)
        {
            Core core = _coreHelper.GetCore();
            var siteDto = core.SiteRead(id);

            return siteDto != null
                ? new OperationDataResult<Site_Dto>(true, siteDto)
                : new OperationDataResult<Site_Dto>(false, $"Worker with id {id} could not be edited!");
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
                            ? new OperationResult(true, "Worker was updated successfully")
                            : new OperationResult(false, $"Worker with id {simpleSiteModel.Id} could not be updated!");
                    }
                    else
                    {
                        return new OperationResult(false, "Worker with such UId could not be obtained");
                    }
                }
                return new OperationResult(false, "Worker UId not found");
            }
            catch (Exception)
            {
                return new OperationResult(false, "Worker could not be updated");
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
                    ? new OperationResult(true, $"Worker \"{siteNameDto.SiteName}\" deleted successfully")
                    : new OperationResult(false, $"Worker \"{siteNameDto.SiteName}\" could not be deleted!");
            }
            catch (Exception)
            {
                return new OperationResult(false, $"Worker with id \"{id}\" could not be deleted!");
            }
        }
    }
}
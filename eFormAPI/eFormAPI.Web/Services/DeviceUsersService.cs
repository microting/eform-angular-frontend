/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
using System;
using System.Collections.Generic;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Advanced;
using eFormAPI.Web.Infrastructure.Models;
using Microting.eForm.Dto;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services
{
    public class DeviceUsersService : IDeviceUsersService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;

        public DeviceUsersService(ILocalizationService localizationService, 
            IEFormCoreService coreHelper)
        {
            _localizationService = localizationService;
            _coreHelper = coreHelper;
        }

        public OperationDataResult<List<Site_Dto>> Index()
        {
            var core = _coreHelper.GetCore();
            var siteDto = core.SiteReadAll(false);
            return new OperationDataResult<List<Site_Dto>>(true, siteDto);
        }

        public OperationResult Create(DeviceUserModel deviceUserModel)
        {
            var core = _coreHelper.GetCore();
            var siteName = deviceUserModel.UserFirstName + " " + deviceUserModel.UserLastName;

            try
            {
                var siteDto = core.SiteCreate(siteName, deviceUserModel.UserFirstName, deviceUserModel.UserLastName,
                    null);

                return siteDto != null
                    ? new OperationResult(true,
                        _localizationService.GetStringWithFormat("DeviceUserParamCreatedSuccessfully", siteDto.SiteName))
                    : new OperationResult(false, _localizationService.GetString("DeviceUserCouldNotBeCreated"));
            }
            catch (Exception ex)
            {
                try
                {
                    if (ex.InnerException.Message == "The remote server returned an error: (402) Payment Required.")
                    {
                        return new OperationResult(false, _localizationService.GetString("YouNeedToBuyMoreLicenses"));
                    }
                    else
                    {
                        return new OperationResult(false, _localizationService.GetString("DeviceUserCouldNotBeCreated"));
                    }
                }
                catch
                {
                    return new OperationResult(false, _localizationService.GetString("DeviceUserCouldNotBeCreated"));
                }
            }
        }

        public OperationDataResult<Site_Dto> Edit(int id)
        {
            var core = _coreHelper.GetCore();
            var siteDto = core.SiteRead(id);

            return siteDto != null
                ? new OperationDataResult<Site_Dto>(true, siteDto)
                : new OperationDataResult<Site_Dto>(false,
                    _localizationService.GetStringWithFormat("DeviceUserParamCouldNotBeEdited", id));
        }

        public OperationResult Update(DeviceUserModel deviceUserModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var siteDto = core.SiteRead(deviceUserModel.Id);
                if (siteDto.WorkerUid != null)
                {
                    var workerDto = core.Advanced_WorkerRead((int) siteDto.WorkerUid);
                    if (workerDto != null)
                    {
                        var fullName = deviceUserModel.UserFirstName + " " + deviceUserModel.UserLastName;
                        var isUpdated = core.SiteUpdate(deviceUserModel.Id, fullName, deviceUserModel.UserFirstName,
                            deviceUserModel.UserLastName, workerDto.Email);

                        return isUpdated
                            ? new OperationResult(true, _localizationService.GetString("DeviceUserUpdatedSuccessfully"))
                            : new OperationResult(false,
                                _localizationService.GetStringWithFormat("DeviceUserParamCouldNotBeUpdated", deviceUserModel.Id));
                    }

                    return new OperationResult(false, _localizationService.GetString("DeviceUserCouldNotBeObtained"));
                }

                return new OperationResult(false, _localizationService.GetString("DeviceUserNotFound"));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("DeviceUserCouldNotBeUpdated"));
            }
        }

        public OperationResult Delete(int id)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var siteNameDto = core.Advanced_SiteItemRead(id);

                return core.SiteDelete(siteNameDto.SiteUId)
                    ? new OperationResult(true,
                        _localizationService.GetStringWithFormat("DeviceUserParamDeletedSuccessfully", siteNameDto.SiteName))
                    : new OperationResult(false,
                        _localizationService.GetStringWithFormat("DeviceUserParamCouldNotBeDeleted", siteNameDto.SiteName));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetStringWithFormat("DeviceUserParamCouldNotBeDeleted", id));
            }
        }
    }
}
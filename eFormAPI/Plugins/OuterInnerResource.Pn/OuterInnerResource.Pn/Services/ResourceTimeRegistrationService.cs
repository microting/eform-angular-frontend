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

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities;
using OuterInnerResource.Pn.Abstractions;
using OuterInnerResource.Pn.Infrastructure.Models.ResourceTimeRegistrations;
using Rebus.Bus;

namespace OuterInnerResource.Pn.Services
{
    public class ResourceTimeRegistrationService : IResourceTimeRegistrationService
    {
        private readonly OuterInnerResourcePnDbContext _dbContext;
        private readonly IOuterInnerResourceLocalizationService _localizationService;
        private readonly ILogger<InnerResourceService> _logger;
        private readonly IEFormCoreService _coreService;
        private readonly IBus _bus;
        private List<KeyValuePair<int, string>> _deviceUserNames;
        private List<KeyValuePair<int, string>> _outerResourceNames;
        private List<KeyValuePair<int, string>> _innerResourceNames;

        public ResourceTimeRegistrationService(OuterInnerResourcePnDbContext dbContext,
            IOuterInnerResourceLocalizationService localizationService,
            ILogger<InnerResourceService> logger, 
            IEFormCoreService coreService, 
            IRebusService rebusService)
        {
            _dbContext = dbContext;
            _localizationService = localizationService;
            _logger = logger;
            _coreService = coreService;
            _bus = rebusService.GetBus();
            _deviceUserNames = new List<KeyValuePair<int, string>>();
            _outerResourceNames = new List<KeyValuePair<int, string>>();
            _innerResourceNames = new List<KeyValuePair<int, string>>();
        }
        
        public async Task<OperationDataResult<ResourceTimeRegistrationsModel>> GetAllRegistrations(int lastRegistrationId)
        {
            ResourceTimeRegistrationsModel resourceTimeRegistrationsModel = new ResourceTimeRegistrationsModel();
            resourceTimeRegistrationsModel.ResourceTimeRegistrationModels = new List<ResourceTimeRegistrationModel>();

            var results = await _dbContext.ResourceTimeRegistrations.AsNoTracking().Where(x => x.Id > lastRegistrationId).Take(10).OrderBy(x => x.Id).ToListAsync();
            foreach (ResourceTimeRegistration resourceTimeRegistration in results)
            {
                var registration = new ResourceTimeRegistrationModel()
                {
                    DoneAt = resourceTimeRegistration.DoneAt,
                    DoneByDeviceUserId = resourceTimeRegistration.SDKSiteId,
                    DoneByDeviceUserName = "",
                    Id = resourceTimeRegistration.Id,
                    InnerResourceId = resourceTimeRegistration.InnerResourceId,
                    InnerResourceName = "",
                    OuterResourceId = resourceTimeRegistration.OuterResourceId,
                    OuterResourceName = "",
                    SdkCaseId = resourceTimeRegistration.SDKCaseId,
                    TimeInSeconds = resourceTimeRegistration.TimeInSeconds
                };
                
                if (_deviceUserNames.Any(x => x.Key == registration.DoneByDeviceUserId))
                {
                    registration.DoneByDeviceUserName =
                        _deviceUserNames.First(x => x.Key == registration.DoneByDeviceUserId).Value;
                }
                else
                {
                    try
                    {
                        registration.DoneByDeviceUserName = _coreService.GetCore().Result.SiteRead(registration.DoneByDeviceUserId)?.Result.SiteName;
                        _deviceUserNames.Add(new KeyValuePair<int, string>(registration.DoneByDeviceUserId, registration.DoneByDeviceUserName));
                    }
                    catch
                    {
                        
                    }
                    
                }

                if (_outerResourceNames.Any(x => x.Key == registration.OuterResourceId))
                {
                    registration.OuterResourceName =
                        _outerResourceNames.First(x => x.Key == registration.OuterResourceId).Value;
                }
                else
                {
                    registration.OuterResourceName =
                        _dbContext.OuterResources.First(x => x.Id == registration.OuterResourceId).Name;
                    _outerResourceNames.Add(new KeyValuePair<int, string>(registration.OuterResourceId, registration.OuterResourceName));
                }

                if (_innerResourceNames.Any(x => x.Key == registration.InnerResourceId))
                {
                    registration.InnerResourceName =
                        _innerResourceNames.First(x => x.Key == registration.InnerResourceId).Value;
                }
                else
                {
                    registration.InnerResourceName =
                        _dbContext.InnerResources.First(x => x.Id == registration.InnerResourceId).Name;
                    _innerResourceNames.Add(new KeyValuePair<int, string>(registration.InnerResourceId, registration.InnerResourceName));
                }
                resourceTimeRegistrationsModel.ResourceTimeRegistrationModels.Add(registration);
                
            }

            if (results.Count > 0)
            {
                resourceTimeRegistrationsModel.LastResourceTimeRegistrationId = results.Last().Id;
            }
            
            return new OperationDataResult<ResourceTimeRegistrationsModel>(true, resourceTimeRegistrationsModel);
        }
    }
}
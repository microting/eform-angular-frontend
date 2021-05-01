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
using System.Linq;
using System.Threading.Tasks;
using eFormCore;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Dto;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Models;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Constants;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities;
using OuterInnerResource.Pn.Infrastructure.Helpers;
using OuterInnerResource.Pn.Infrastructure.Models.InnerResources;
using OuterInnerResource.Pn.Infrastructure.Models.OuterResources;
using OuterInnerResource.Pn.Messages;
using Rebus.Bus;
using Rebus.Handlers;

namespace OuterInnerResource.Pn.Handlers
{
    public class OuterInnerResourceUpdateHandler : IHandleMessages<OuterInnerResourceUpdate>
    {  
        private readonly Core _core;
        private readonly OuterInnerResourcePnDbContext _dbContext;  
        private readonly IBus _bus;      
        
        public OuterInnerResourceUpdateHandler(Core core, DbContextHelper dbContextHelper, IBus bus)
        {
            _core = core;
            _dbContext = dbContextHelper.GetDbContext();
            _bus = bus;
        }
        
        #pragma warning disable 1998
        public async Task Handle(OuterInnerResourceUpdate message)
        {            
            string lookup = $"OuterInnerResourceSettings:{OuterInnerResourceSettingsEnum.SdkeFormId.ToString()}";

            var result = _dbContext.PluginConfigurationValues.AsNoTracking()
                .FirstOrDefault(x => 
                    x.Name == lookup)?.Value;
            if (result != null)
            {
                int eFormId = int.Parse(result);

                List<SiteDto> sites = new List<SiteDto>();
            
                lookup = $"OuterInnerResourceSettings:{OuterInnerResourceSettingsEnum.EnabledSiteIds.ToString()}"; 
                result = _dbContext.PluginConfigurationValues.AsNoTracking()
                    .FirstOrDefault(x => 
                        x.Name == lookup)?.Value;
                if (result != null)
                {
                    string sdkSiteIds = result;
                    foreach (string siteId in sdkSiteIds.Split(","))
                    {
                        sites.Add(await _core.SiteRead(int.Parse(siteId)));
                    }

                    Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities.OuterInnerResource outerInnerResource =
                        await _dbContext.OuterInnerResources.SingleOrDefaultAsync(x => 
                            x.Id == message.OuterInnerResourceId);

                    await UpdateSitesDeployed(outerInnerResource, sites, eFormId);
                }
            }
        }

        private async Task UpdateSitesDeployed(
            Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities.OuterInnerResource outerInnerResource, List<SiteDto> sites, int eFormId)
        {

            WriteLogEntry("OuterInnerResourceUpdateHandler: UpdateSitesDeployed called");
            List<int> siteIds = new List<int>();
            
            if (outerInnerResource.WorkflowState == Constants.WorkflowStates.Created)
            {
                if (sites.Any())
                {
                    foreach (SiteDto siteDto in sites)
                    {
                        siteIds.Add(siteDto.SiteId);
                        List<OuterInnerResourceSite> outerInnerResourceSites = await _dbContext.OuterInnerResourceSites.Where(
                            x =>
                                x.MicrotingSdkSiteId == siteDto.SiteId
                                && x.OuterInnerResourceId == outerInnerResource.Id
                                && x.WorkflowState == Constants.WorkflowStates.Created).ToListAsync();
                        if (!outerInnerResourceSites.Any())
                        {
                            OuterInnerResourceSite outerInnerResourceSite = new OuterInnerResourceSite
                            {
                                OuterInnerResourceId = outerInnerResource.Id,
                                MicrotingSdkSiteId = siteDto.SiteId,
                                MicrotingSdkeFormId = eFormId
                            };
                            await outerInnerResourceSite.Create(_dbContext);
                            await _bus.SendLocal(new OuterInnerResourcePosteForm(outerInnerResourceSite.Id,
                                eFormId));
                        }
                        else
                        {
                            if (outerInnerResourceSites.First().MicrotingSdkCaseId == null)
                            {
                                await _bus.SendLocal(new OuterInnerResourcePosteForm(
                                    outerInnerResourceSites.First().Id,
                                    eFormId));
                            }
                        }
                    }
                } 
            }
            var sitesConfigured = _dbContext.OuterInnerResourceSites.Where(x => 
                x.OuterInnerResourceId == outerInnerResource.Id 
                && x.WorkflowState != Constants.WorkflowStates.Removed).ToList();
            WriteLogEntry("OuterInnerResourceUpdateHandler: sitesConfigured looked up");

            if (sitesConfigured.Any())
            {
                foreach (OuterInnerResourceSite outerInnerResourceSite in sitesConfigured)
                {
                    if (!siteIds.Contains(outerInnerResourceSite.MicrotingSdkSiteId) 
                        || outerInnerResource.WorkflowState == Constants.WorkflowStates.Removed)
                    {
                        if (outerInnerResourceSite.MicrotingSdkCaseId != null)
                        {
                            await outerInnerResourceSite.Delete(_dbContext);
                            await _bus.SendLocal(new OuterInnerResourceDeleteFromServer(outerInnerResourceSite.Id));
                        }
                    }
                }    
            }
        }

        private void WriteLogEntry(string message)
        {
            var oldColor = Console.ForegroundColor;
            Console.ForegroundColor = ConsoleColor.Gray;
            Console.WriteLine("[DBG] " + message);
            Console.ForegroundColor = oldColor;
        }
    }
}
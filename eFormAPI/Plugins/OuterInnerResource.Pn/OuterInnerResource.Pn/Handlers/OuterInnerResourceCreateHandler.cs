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
    public class OuterInnerResourceCreateHandler : IHandleMessages<OuterInnerResourceCreate>
    {        
        private readonly Core _core;
        private readonly OuterInnerResourcePnDbContext _dbContext;  
        private readonly IBus _bus;

        public OuterInnerResourceCreateHandler(Core core, DbContextHelper dbContextHelper, IBus bus)
        {
            _core = core;
            _dbContext = dbContextHelper.GetDbContext();
            _bus = bus;
        }
        
        #pragma warning disable 1998
        public async Task Handle(OuterInnerResourceCreate message)
        {            
            string lookup = $"OuterInnerResourceSettings:{OuterInnerResourceSettingsEnum.SdkeFormId.ToString()}"; 
            
            LogEvent($"lookup is {lookup}");

            string result = _dbContext.PluginConfigurationValues.AsNoTracking()
                .FirstOrDefault(x =>
                    x.Name == lookup)
                ?.Value;
            
            LogEvent($"result is {result}");

            if (result != null)
            {
                int eFormId = int.Parse(result);

                List<SiteDto> sites = new List<SiteDto>();
            
                lookup = $"OuterInnerResourceSettings:{OuterInnerResourceSettingsEnum.EnabledSiteIds.ToString()}"; 
                LogEvent($"lookup is {lookup}");

                string sdkSiteIds = _dbContext.PluginConfigurationValues.AsNoTracking()
                    .FirstOrDefault(x => 
                        x.Name == lookup)?.Value;


                if (sdkSiteIds != null)
                {
                    LogEvent($"sdkSiteIds is {sdkSiteIds}");
                    foreach (string siteId in sdkSiteIds.Split(","))
                    {
                        LogEvent($"found siteId {siteId}");
                        sites.Add(await _core.SiteRead(int.Parse(siteId)));
                    }
                }

                if (message.InnerResourceModel != null)
                {
                    await CreateFromInnerResource(message.InnerResourceModel, sites, eFormId);
                }
                else
                {
                    await CreateFromOuterResource(message.OuterResourceModel, sites, eFormId);
                }
            }
        }

        private async Task CreateFromInnerResource(InnerResourceModel model, List<SiteDto> sites, int eFormId)
        {
            if (model.RelatedOuterResourcesIds != null)
            {
                foreach (int id in model.RelatedOuterResourcesIds)
                {                
                    OuterResource outerResource = _dbContext.OuterResources.SingleOrDefault(x => x.Id == id);
                    await CreateRelationships(model.Id, id, model.Name, outerResource.Name, sites, eFormId);              
                }    
            }
        }

        private async Task CreateFromOuterResource(OuterResourceModel model, List<SiteDto> sites, int eFormId)
        {
            if (model.RelatedInnerResourcesIds != null)
            {
                foreach (int id in model.RelatedInnerResourcesIds)
                {
                    InnerResource innerResource = _dbContext.InnerResources.SingleOrDefault(x => x.Id == id);
                    await CreateRelationships(id, model.Id, innerResource.Name, model.Name, sites, eFormId);
                }    
            }
        }

        private async Task CreateRelationships(int innerResourceId, int outerResourceId, string innerResourceName, string outerResourceName, List<SiteDto> sites, int eFormId)
        {
            Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities.OuterInnerResource outerInnerResource = _dbContext.OuterInnerResources.SingleOrDefault(x =>
                    x.InnerResourceId == innerResourceId && x.OuterResourceId == outerResourceId);

            if (sites.Any())
            {
                foreach (SiteDto siteDto in sites)
                {
                    List<OuterInnerResourceSite> siteMatch = await _dbContext.OuterInnerResourceSites.Where(x =>
                        x.MicrotingSdkSiteId == siteDto.SiteId && x.OuterInnerResourceId == outerInnerResource.Id).ToListAsync();
                    if (!siteMatch.Any())
                    {
                        OuterInnerResourceSite outerInnerResourceSite = new OuterInnerResourceSite
                        {
                            OuterInnerResourceId = outerInnerResource.Id,
                            MicrotingSdkSiteId = siteDto.SiteId,
                            MicrotingSdkeFormId = eFormId
                        };
                        await outerInnerResourceSite.Create(_dbContext);
                        await _bus.SendLocal(new OuterInnerResourcePosteForm(outerInnerResourceSite.Id, eFormId));
                    }
                }   
            }
        }
        
        private void LogEvent(string appendText)
        {
            try
            {                
                ConsoleColor oldColor = Console.ForegroundColor;
                Console.ForegroundColor = ConsoleColor.Gray;
                Console.WriteLine("[DBG] " + appendText);
                Console.ForegroundColor = oldColor;
            }
            catch
            {
            }
        }

        private void LogException(string appendText)
        {
            try
            {
                ConsoleColor oldColor = Console.ForegroundColor;
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine("[ERR] " + appendText);
                Console.ForegroundColor = oldColor;
            }
            catch
            {

            }
        }
    }
}
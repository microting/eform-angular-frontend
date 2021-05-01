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
using eFormCore;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities;
using OuterInnerResource.Pn.Infrastructure.Helpers;
using OuterInnerResource.Pn.Infrastructure.Models.InnerResources;
using OuterInnerResource.Pn.Infrastructure.Models.OuterResources;
using OuterInnerResource.Pn.Messages;
using Rebus.Handlers;

namespace OuterInnerResource.Pn.Handlers
{
    public class OuterInnerResourceDeleteHandler : IHandleMessages<OuterInnerResourceDelete>
    {    
        private readonly Core _core;
        private readonly OuterInnerResourcePnDbContext _dbContext;        
        
        public OuterInnerResourceDeleteHandler(Core core, DbContextHelper dbContextHelper)
        {
            _core = core;
            _dbContext = dbContextHelper.GetDbContext();
        }
        
        #pragma warning disable 1998
        public async Task Handle(OuterInnerResourceDelete message)
        {            
            if (message.InnerResourceModel != null)
            {
                await DeleteFromInnerResource(message.InnerResourceModel);
            }
            else
            {
                await DeleteFromOuterResource(message.OuterResourceModel);
            }     
        }

        private async Task DeleteFromInnerResource(InnerResourceModel innerResourceModel)
        {
            List<Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities.OuterInnerResource> outerInnerResources = _dbContext.OuterInnerResources.Where(x =>
                x.InnerResourceId == innerResourceModel.Id).ToList();
            await DeleteRelationships(outerInnerResources);
        }

        private async Task DeleteFromOuterResource(OuterResourceModel outerResourceModel)
        {
            List<Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities.OuterInnerResource> outerInnerResources = _dbContext.OuterInnerResources.Where(x =>
                x.OuterResourceId == outerResourceModel.Id).ToList();
            await DeleteRelationships(outerInnerResources);

        }

        private async Task DeleteRelationships(List<Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities.OuterInnerResource> outerInnerResources)
        {
            foreach (Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities.OuterInnerResource outerInnerResource in outerInnerResources)
            {
                IQueryable<OuterInnerResourceSite> outerInnerResourceSites = _dbContext.OuterInnerResourceSites.Where(x => x.OuterInnerResourceId == outerInnerResource.Id);
                int numSites = outerInnerResourceSites.Count();
                int sitesDeleted = 0;
                foreach (OuterInnerResourceSite outerInnerResourceSite in outerInnerResourceSites)
                {
                    try
                    {
                        if (outerInnerResourceSite.MicrotingSdkCaseId != null) {
                            bool result = await _core.CaseDelete((int)outerInnerResourceSite.MicrotingSdkCaseId);
                            if (result)
                            {
                                await outerInnerResourceSite.Delete(_dbContext);
                                sitesDeleted += 1;
                            }
                        }
                    }
                    catch
                    {
                        
                    }
                    
                }

                if (numSites == sitesDeleted)
                {
                    await outerInnerResource.Delete(_dbContext);
                }
            }
        }
    }
}
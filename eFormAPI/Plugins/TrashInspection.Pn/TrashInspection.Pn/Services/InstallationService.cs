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
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure.Constants;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using OpenStack.NetCoreSwiftClient.Extensions;
using TrashInspection.Pn.Abstractions;
using TrashInspection.Pn.Infrastructure.Models;

namespace TrashInspection.Pn.Services
{
    using Microting.eFormApi.BasePn.Infrastructure.Helpers;

    public class InstallationService : IInstallationService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly TrashInspectionPnDbContext _dbContext;
        private readonly ITrashInspectionLocalizationService _trashInspectionLocalizationService;

        public InstallationService(TrashInspectionPnDbContext dbContext,
            IEFormCoreService coreHelper,
            ITrashInspectionLocalizationService trashInspectionLocalizationService)
        {
            _dbContext = dbContext;
            _coreHelper = coreHelper;
            _trashInspectionLocalizationService = trashInspectionLocalizationService;
        }

        public async Task<OperationDataResult<InstallationsModel>> Index(InstallationRequestModel pnRequestModel)
        {
            try
            {
                var installationsModel = new InstallationsModel();

                var installationsQuery = _dbContext.Installations
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed)
                        .AsQueryable();

                if (!pnRequestModel.NameFilter.IsNullOrEmpty() && pnRequestModel.NameFilter != "")
                {
                    installationsQuery = installationsQuery.Where(x => x.Name.Contains(pnRequestModel.NameFilter));
                }

                QueryHelper.AddSortToQuery(installationsQuery, pnRequestModel.Sort, pnRequestModel.IsSortDsc);

                installationsModel.Total = installationsQuery.Count();

                installationsQuery
                    = installationsQuery
                        .Skip(pnRequestModel.Offset)
                        .Take(pnRequestModel.PageSize);

                var installations = await installationsQuery.Select(x => new InstallationModel
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToListAsync();

                installationsModel.InstallationList = installations;


                return new OperationDataResult<InstallationsModel>(true, installationsModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<InstallationsModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingInstallations"));

            }
        }

        public async Task<OperationResult> Create(InstallationModel createModel)
        {
            var installation = new Installation
            {
                Name = createModel.Name
            };
            await installation.Create(_dbContext);

            foreach (var deployedCheckbox in createModel.DeployCheckboxes)
            {
                if (deployedCheckbox.IsChecked)
                {
                    var installationSite = new InstallationSite
                    {
                        InstallationId = installation.Id,
                        SDKSiteId = deployedCheckbox.Id
                    };
                    await installationSite.Create(_dbContext);
                }
            }
            return new OperationResult(true);

        }

        public async Task<OperationDataResult<InstallationModel>> Read(int id)
        {
            try
            {
                var installation = await _dbContext.Installations
                    .AsNoTracking()
                    .Select(x => new InstallationModel
                    {
                        Name = x.Name,
                        Id = x.Id,
                        DeployCheckboxes = x.InstallationSites
                            .Where(y => y.WorkflowState != Constants.WorkflowStates.Removed)
                            .Select(y => new DeployCheckbox
                            {
                                Id = y.SDKSiteId,
                                IsChecked = true
                            })
                            .ToList()
                    }).FirstOrDefaultAsync(x => x.Id == id);

                if (installation == null)
                {
                    return new OperationDataResult<InstallationModel>(false,
                        _trashInspectionLocalizationService.GetString($"InstallationWithID:{id}DoesNotExist"));
                }


                return new OperationDataResult<InstallationModel>(true, installation);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _coreHelper.LogException(e.Message);
                return new OperationDataResult<InstallationModel>(false,
                    _trashInspectionLocalizationService.GetString("ErrorObtainingInstallation"));
            }
        }

        public async Task<OperationResult> Update(InstallationModel updateModel)
        {
            var installation =
                await _dbContext.Installations.SingleOrDefaultAsync(x => x.Id == updateModel.Id);
            if (installation != null)
            {
                installation.Name = updateModel.Name;
                await installation.Update(_dbContext);

                var installationSites = installation.InstallationSites;
                var toBeRemovedInstallationSites = installationSites;

                foreach (var deployedCheckbox in updateModel.DeployCheckboxes)
                {
                    var installationSite =
                        installationSites.SingleOrDefault(x => x.SDKSiteId == deployedCheckbox.Id);
                    if (installationSite == null)
                    {
                        installationSite = new InstallationSite
                        {
                            InstallationId = installation.Id,
                            SDKSiteId = deployedCheckbox.Id
                        };
                        await installationSite.Create(_dbContext);
                    }
                    else
                    {
                        if (installationSite.WorkflowState == Constants.WorkflowStates.Removed)
                        {
                            installationSite.WorkflowState = Constants.WorkflowStates.Created;
                            await installationSite.Update(_dbContext);

                        }
                        toBeRemovedInstallationSites.Remove(installationSite);
                    }
                }

                foreach (var installationSite in toBeRemovedInstallationSites)
                {
                    await installationSite.Delete(_dbContext);
                }
                return new OperationResult(true);
            }
            return new OperationResult(false);
        }

        public async Task<OperationResult> Delete(int id)
        {
            var installation =
                await _dbContext.Installations.SingleOrDefaultAsync(x => x.Id == id);
            await installation.Delete(_dbContext);
            return new OperationResult(true);

        }
    }
}

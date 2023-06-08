/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

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


namespace eFormAPI.Web.Services;

using Microting.EformAngularFrontendBase.Infrastructure.Const;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abstractions;
using Abstractions.Advanced;
using Infrastructure.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eForm.Dto;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

public class WorkersService : IWorkersService
{
    private readonly IEFormCoreService _coreHelper;
    private readonly ILocalizationService _localizationService;

    public WorkersService(IEFormCoreService coreHelper,
        ILocalizationService localizationService)
    {
        _coreHelper = coreHelper;
        _localizationService = localizationService;
    }

    [Authorize(Policy = AuthConsts.EformPolicies.Workers.Read)]
    public async Task<OperationDataResult<List<WorkerDto>>> Index()
    {
        var core = await _coreHelper.GetCore();
        var workersDto = await core.Advanced_WorkerReadAll("not_removed", null, null);

        return new OperationDataResult<List<WorkerDto>>(true, workersDto);
    }

    public async Task<OperationDataResult<WorkerDto>> Read(int id)
    {
        var core = await _coreHelper.GetCore();
        var workerDto = await core.Advanced_WorkerRead(id);

        return new OperationDataResult<WorkerDto>(true, workerDto);
    }

    public async Task<OperationResult> Update(WorkerModel workerModel)
    {
        try
        {
            var core = await _coreHelper.GetCore();
            var workerDto = await core.Advanced_WorkerRead(workerModel.Id);
            var isUpdated = await core.Advanced_WorkerUpdate(workerModel.Id, workerModel.UserFirstName,
                workerModel.UserLastName, workerDto.Email, "");

            return isUpdated
                ? new OperationResult(true, _localizationService.GetStringWithFormat("WorkerParamWasUpdated", workerModel.Id))
                : new OperationResult(false, _localizationService.GetStringWithFormat("WorkerParamCantBeUpdated", workerModel.Id));
        }
        catch (Exception)
        {
            return new OperationResult(false, _localizationService.GetStringWithFormat("WorkerParamCantBeUpdated", workerModel.Id));
        }
    }

    public async Task<OperationResult> Create(WorkerCreateModel model)
    {
        try
        {
            var core = await _coreHelper.GetCore();
            var workerDto = await core.Advanced_WorkerCreate(model.FirstName, model.LastName,
                model.SiteId + "." + model.CustomerNo + "@invalid.invalid", "");
            var createdWorker =
                core.Advanced_SiteWorkerCreate(new SiteNameDto
                {
                    SiteUId = model.SiteId,
                    SiteName = ""
                }, workerDto);

            return new OperationResult(true, _localizationService.GetString("WorkerWasSuccessfullyCreated"));
        }
        catch (Exception)
        {
            return new OperationResult(false, _localizationService.GetString("ErrorWhileCreatingWorker"));
        }
    }

    [HttpGet]
    public async Task<OperationResult> Delete(int id)
    {
        try
        {
            var core = await _coreHelper.GetCore();
            var workerDto = await core.Advanced_WorkerRead(id);

            if (workerDto.Equals(null))
            {
                return new OperationResult(false,
                    _localizationService.GetStringWithFormat("SiteWithIdCouldNotBeDeleted", id));
            }

            return await core.Advanced_WorkerDelete(id)
                ? new OperationResult(true,
                    _localizationService.GetStringWithFormat(
                        "WorkerParamDeletedSuccessfully",
                        workerDto.FirstName,
                        workerDto.LastName))
                : new OperationResult(false,
                    _localizationService.GetStringWithFormat("WorkerParamCantBeDeleted", workerDto.FirstName, workerDto.LastName));
        }

        catch (Exception)
        {
            return new OperationResult(false,
                _localizationService.GetStringWithFormat("SiteWithIdCouldNotBeDeleted", id));
        }
    }
}
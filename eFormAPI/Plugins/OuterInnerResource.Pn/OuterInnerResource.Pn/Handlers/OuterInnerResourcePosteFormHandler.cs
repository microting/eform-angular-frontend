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
using Microting.eForm.Infrastructure;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.eForm.Infrastructure.Models;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Constants;
using Microting.eFormOuterInnerResourceBase.Infrastructure.Data.Entities;
using OuterInnerResource.Pn.Infrastructure.Helpers;
using OuterInnerResource.Pn.Messages;
using Rebus.Handlers;

namespace OuterInnerResource.Pn.Handlers
{
    public class OuterInnerResourcePosteFormHandler : IHandleMessages<OuterInnerResourcePosteForm>
    {
        private readonly Core _core;
        private readonly OuterInnerResourcePnDbContext _dbContext;

        public OuterInnerResourcePosteFormHandler(Core core, DbContextHelper dbContextHelper)
        {
            _core = core;
            _dbContext = dbContextHelper.GetDbContext();
        }

        public async Task Handle(OuterInnerResourcePosteForm message)
        {
            OuterInnerResourceSite outerInnerResourceSite =
                await _dbContext.OuterInnerResourceSites.SingleOrDefaultAsync(x =>
                    x.Id == message.OuterInnerResourceSiteId).ConfigureAwait(false);
            await using MicrotingDbContext microtingDbContext = _core.dbContextHelper.GetDbContext();
            Site siteDto = await microtingDbContext.Sites.SingleAsync(x => x.Id == outerInnerResourceSite.MicrotingSdkSiteId);
            Language language = await microtingDbContext.Languages.SingleAsync(x => x.Id == siteDto.LanguageId);
            MainElement mainElement = await _core.ReadeForm(message.SdkeFormId, language);

            mainElement.Label = outerInnerResourceSite.OuterInnerResource.InnerResource.Name;
            mainElement.ElementList[0].Label = outerInnerResourceSite.OuterInnerResource.InnerResource.Name;
            mainElement.EndDate = DateTime.Now.AddYears(10).ToUniversalTime();
            mainElement.StartDate = DateTime.Now.ToUniversalTime();
            mainElement.Repeated = 0;

            string lookup = $"OuterInnerResourceSettings:{OuterInnerResourceSettingsEnum.QuickSyncEnabled.ToString()}";

            bool quickSyncEnabled = _dbContext.PluginConfigurationValues.AsNoTracking()
                                        .FirstOrDefault(x =>
                                            x.Name == lookup)?.Value == "true";

            if (quickSyncEnabled)
            {
                mainElement.EnableQuickSync = true;
            }

            List<FolderDto> folderDtos = await _core.FolderGetAll(true).ConfigureAwait(false);

            bool folderAlreadyExist = false;
            int _microtingUId = 0;
            int sdkFolderId = 0;
            foreach (FolderDto folderDto in folderDtos)
            {
                if (folderDto.Name == outerInnerResourceSite.OuterInnerResource.OuterResource.Name)
                {
                    folderAlreadyExist = true;
                    _microtingUId = (int)folderDto.MicrotingUId;
                    sdkFolderId = (int)folderDto.Id;
                }
            }

            if (!folderAlreadyExist)
            {
                await _core.FolderCreate(outerInnerResourceSite.OuterInnerResource.OuterResource.Name,
                    "", null).ConfigureAwait(false);
                folderDtos = await _core.FolderGetAll(true).ConfigureAwait(false);

                foreach (FolderDto folderDto in folderDtos)
                {
                    if (folderDto.Name == outerInnerResourceSite.OuterInnerResource.OuterResource.Name)
                    {
                        _microtingUId = (int) folderDto.MicrotingUId;
                        sdkFolderId = (int)folderDto.Id;
                    }
                }
            }

            mainElement.CheckListFolderName = _microtingUId.ToString();

            DataElement dataElement = (DataElement)mainElement.ElementList[0];

            dataElement.DataItemList.Add(new None(
                1,
                false,
                false,
                $"{outerInnerResourceSite.OuterInnerResource.OuterResource.Name} - {outerInnerResourceSite.OuterInnerResource.InnerResource.Name}",
                "",
                Constants.FieldColors.Default,
                -999,
                false));

            int? sdkCaseId = await _core.CaseCreate(mainElement, "", (int)siteDto.MicrotingUid, sdkFolderId).ConfigureAwait(false);

            outerInnerResourceSite.MicrotingSdkCaseId = sdkCaseId;
            await outerInnerResourceSite.Update(_dbContext).ConfigureAwait(false);
        }

    }
}
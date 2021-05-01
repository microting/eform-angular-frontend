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
using Microting.eFormTrashInspectionBase.Infrastructure.Data;
using Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities;
using Rebus.Handlers;
using TrashInspection.Pn.Infrastructure.Helpers;
using TrashInspection.Pn.Infrastructure.Models;
using TrashInspection.Pn.Messages;

namespace TrashInspection.Pn.Handlers
{
    public class TrashInspectionDeleteHandler : IHandleMessages<TrashInspectionDeleted>
    {
        private readonly Core _core;
        private readonly TrashInspectionPnDbContext _dbContext;

        public TrashInspectionDeleteHandler(Core core, DbContextHelper dbContextHelper)
        {
            _core = core;
            _dbContext = dbContextHelper.GetDbContext();
        }

        #pragma warning disable 1998
        public async Task Handle(TrashInspectionDeleted message)
        {
            try
            {
                TrashInspectionModel createModel = message.TrashInspectionModel;

                List<TrashInspectionCase> trashInspectionCases = _dbContext.TrashInspectionCases
                    .Where(x => x.TrashInspectionId == createModel.Id).ToList();

                foreach (TrashInspectionCase trashInspectionCase in trashInspectionCases)
                {
                    bool result = await _core.CaseDelete(int.Parse(trashInspectionCase.SdkCaseId));
                    if (result)
                    {
                        await trashInspectionCase.Delete(_dbContext);
                    }

                }

                Microting.eFormTrashInspectionBase.Infrastructure.Data.Entities.TrashInspection trashInspection = await
                    _dbContext.TrashInspections.SingleAsync(x => x.Id == createModel.Id);

                trashInspection.InspectionDone = true;
                await trashInspection.Update(_dbContext);

                if (message.ShouldDelete)
                {
                    await trashInspection.Delete(_dbContext);
                }
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.Message);
            }
        }
    }
}
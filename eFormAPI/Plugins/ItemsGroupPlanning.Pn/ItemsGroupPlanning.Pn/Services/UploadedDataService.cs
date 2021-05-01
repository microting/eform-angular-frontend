namespace ItemsGroupPlanning.Pn.Services
{
    using System;
    using System.Collections.Generic;
    using System.Diagnostics;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using Abstractions;
    using Infrastructure.Models;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure.Constants;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using Microting.ItemsGroupPlanningBase.Infrastructure.Data;
    using Microting.ItemsGroupPlanningBase.Infrastructure.Data.Entities;
    using Settings = Microting.eForm.Dto.Settings;

    public class UploadedDataService : IUploadedDataService
    {
        private readonly ItemsGroupPlanningPnDbContext _dbContext;
        private readonly IItemsPlanningLocalizationService _itemsPlanningLocalizationService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEFormCoreService _core;

        public UploadedDataService(ItemsGroupPlanningPnDbContext dbContext,
            IItemsPlanningLocalizationService itemsPlanningLocalizationService,
            IHttpContextAccessor httpContextAccessor, IEFormCoreService core)
        {
            _dbContext = dbContext;
            _itemsPlanningLocalizationService = itemsPlanningLocalizationService;
            _httpContextAccessor = httpContextAccessor;
            _core = core;
        }

        public async Task<OperationDataResult<UploadedDatasModel>> Index(int itemCaseId)
        {

            try
            {
                UploadedDatasModel uploadedDatasModel = new UploadedDatasModel();

                IQueryable<UploadedData> uploadedDataQuery = _dbContext.UploadedDatas.AsQueryable();

                uploadedDataQuery
                    = uploadedDataQuery
                        .Where(x => x.WorkflowState != Constants.WorkflowStates.Removed && x.ItemCaseId == itemCaseId);

                List<UploadedDataModel> uploadedDatas = await uploadedDataQuery.Select(x => new UploadedDataModel()
                {
                    Id = x.Id,
                    Checksum = x.Checksum,
                    CurrentFile = x.CurrentFile,
                    Extension = x.Extension,
                    FileLocation = x.FileLocation,
                    FileName = x.FileName,
                    ItemCaseId = x.ItemCaseId,
                    UploaderType = x.UploaderType
                }).ToListAsync();

                uploadedDatasModel.Total =
                    _dbContext.UploadedDatas.Count(x => x.WorkflowState != Constants.WorkflowStates.Removed);
                uploadedDatasModel.UploadedDatas = uploadedDatas;
                
                return new OperationDataResult<UploadedDatasModel>(true, uploadedDatasModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _core.LogException(e.Message);
                return new OperationDataResult<UploadedDatasModel>(false,
                    _itemsPlanningLocalizationService.GetString("ErrorObtainingUploadedDatas"));
            }
        }
        
        public async Task<OperationDataResult<UploadedDataModel>> Read(int selectedListItemCaseId)
        {
            try
            {
                UploadedDataModel uploadedDataModel = new UploadedDataModel();

                var uploadedData =
                   await _dbContext.UploadedDatas.FirstOrDefaultAsync(x => x.ItemCaseId == selectedListItemCaseId);

                uploadedDataModel.Checksum = uploadedData.Checksum;
                uploadedDataModel.Extension = uploadedData.Extension;
                uploadedDataModel.CurrentFile = uploadedData.CurrentFile;
                uploadedDataModel.FileLocation = uploadedData.FileLocation;
                uploadedDataModel.FileName = uploadedData.FileName;
                uploadedDataModel.UploaderType = uploadedData.UploaderType;
                uploadedDataModel.ItemCaseId = uploadedData.ItemCaseId;
                
                return new OperationDataResult<UploadedDataModel>(true, uploadedDataModel);
            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _core.LogException(e.Message);
                return new OperationDataResult<UploadedDataModel>(false,
                    _itemsPlanningLocalizationService.GetString($"ErrorObtainingUploadedDataWithItemCaseID:{selectedListItemCaseId}"));
            }
            
        }
        
        public async Task<OperationResult> Update(UploadedDataModel uploadedDataModel)
        {

            UploadedData uploadedData =
                await _dbContext.UploadedDatas.SingleOrDefaultAsync(x => x.Id == uploadedDataModel.Id);

            if (uploadedData != null)
            {
                uploadedData.Checksum = uploadedDataModel.Checksum;
                uploadedData.Extension = uploadedDataModel.Extension;
                uploadedData.CurrentFile = uploadedDataModel.CurrentFile;
                uploadedData.FileLocation = uploadedDataModel.FileLocation;
                uploadedData.FileName = uploadedDataModel.FileName;
                uploadedData.UploaderType = uploadedDataModel.UploaderType;
                uploadedData.ItemCaseId = uploadedDataModel.ItemCaseId;

                await uploadedData.Update(_dbContext);
                return new OperationResult(true);
            }
            return new OperationResult(false);
        }

        public async Task<OperationResult> Delete(int id)
        {
            UploadedData uploadedData =
            await _dbContext.UploadedDatas.SingleOrDefaultAsync(x => x.Id == id);

            if (uploadedData != null)
            {
                await uploadedData.Delete(_dbContext);
                return new OperationResult(true);
            }
            return new OperationResult(false);
        }

        public async Task<IActionResult> UploadUploadedDataPdf(UploadedDataPDFUploadModel pdfUploadModel)
        {
            try
            {
                var core =_core.GetCore();
                
                var saveFolder = Path.Combine(await core.Result.GetSdkSetting(Settings.fileLocationPdf), Path.Combine("pdfFiles"));

                Directory.CreateDirectory(saveFolder);

                string fileName = $"ItemCase_{pdfUploadModel.ItemCaseId}_{DateTime.Now.Ticks}.pdf";

                if (pdfUploadModel.File.Length > 0)
                {
                    using (var stream = new FileStream(Path.Combine(saveFolder, fileName), FileMode.Create))
                    {
                        await pdfUploadModel.File.CopyToAsync(stream);
                    }
                }
                if (core.Result.GetSdkSetting(Settings.swiftEnabled).ToString().ToLower() == "true")
                {
                   await core.Result.PutFileToStorageSystem(Path.Combine(saveFolder, fileName), fileName);
                }

                UploadedData uploadedData = new UploadedData();
                uploadedData.FileLocation = saveFolder;
                uploadedData.FileName = fileName;
                uploadedData.ItemCaseId = pdfUploadModel.ItemCaseId;
                
                await uploadedData.Create(_dbContext);
                
                
                return new OkResult();

            }
            catch (Exception e)
            {
                Trace.TraceError(e.Message);
                _core.LogException(e.Message);
                return new BadRequestResult();
            }
        }

        public async Task<IActionResult> DownloadUploadedDataPdf(string fileName)
        {
            var core = _core.GetCore();
            var filePath = Path.Combine(core.Result.GetSdkSetting(Settings.fileLocationPdf) + "pdfFiles/", fileName);
            string fileType = "application/pdf";

            if (core.Result.GetSdkSetting(Settings.swiftEnabled).ToString().ToLower() == "true")
            {
                var ss = await core.Result.GetFileFromSwiftStorage(fileName);
                
                if (ss == null)
                {
                    return new NotFoundResult();
                }
                return new OkObjectResult(ss);
            }

            byte[] fileBytes;
            
            if (File.Exists(filePath))
            {
                fileBytes = File.ReadAllBytes(filePath);
            }
            else
            {
                return new NotFoundResult();
            }
            
            return new FileContentResult(fileBytes, fileType)
            {
                FileDownloadName = fileName
            };
        }
    }
}
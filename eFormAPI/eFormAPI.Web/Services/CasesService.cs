using System;
using System.Collections.Generic;
using eFormAPI.Web.Abstractions;
using eFormCore;
using eFormData;
using eFormShared;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Helpers;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Cases.Request;
using Microting.eFormApi.BasePn.Infrastructure.Models.Cases.Response;

namespace eFormAPI.Web.Services
{
    public class CasesService : ICasesService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;

        public CasesService(IEFormCoreService coreHelper,
            ILocalizationService localizationService)
        {
            _coreHelper = coreHelper;
            _localizationService = localizationService;
        }

        public OperationDataResult<CaseListModel> Index(CaseRequestModel requestModel)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                List<Case> caseList = core.CaseReadAll(requestModel.TemplateId, null, null,
                    Constants.WorkflowStates.NotRemoved, requestModel.NameFilter,
                    requestModel.IsSortDsc, requestModel.Sort);
                CaseListModel model = new CaseListModel()
                {
                    NumOfElements = 40,
                    PageNum = requestModel.PageIndex,
                    Cases = caseList
                };

                return new OperationDataResult<CaseListModel>(true, model);
            }
            catch (Exception)
            {
                return new OperationDataResult<CaseListModel>(false, _localizationService.GetString("CaseLoadingFailed"));
            }
        }

        public OperationDataResult<ReplyElement> Edit(int id)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                Case_Dto caseDto = core.CaseReadByCaseId(id);
                string microtingUId = caseDto.MicrotingUId;
                string microtingCheckUId = caseDto.CheckUId;
                ReplyElement theCase = core.CaseRead(microtingUId, microtingCheckUId);
                theCase.Id = id;

                return !theCase.Equals(null)
                    ? new OperationDataResult<ReplyElement>(true, theCase)
                    : new OperationDataResult<ReplyElement>(false);
            }
            catch (Exception)
            {
                return new OperationDataResult<ReplyElement>(false);
            }
        }

        public OperationResult Delete(int id)
        {
            try
            {
                Core core = _coreHelper.GetCore();

                return core.CaseDeleteResult(id)
                    ? new OperationResult(true, _localizationService.GetString("CaseParamDeletedSuccessfully", id))
                    : new OperationResult(false, _localizationService.GetString("CaseCouldNotBeRemoved"));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("CaseCouldNotBeRemoved"));
            }
        }

        public OperationResult Update(ReplyRequest model)
        {
            List<string> checkListValueList = new List<string>();
            List<string> fieldValueList = new List<string>();
            Core core = _coreHelper.GetCore();
            try
            {
                model.ElementList.ForEach(element =>
                {
                    checkListValueList.AddRange(CaseUpdateHelper.GetCheckList(element));
                    fieldValueList.AddRange(CaseUpdateHelper.GetFieldList(element));
                });
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("CaseCouldNotBeUpdated"));
            }

            try
            {
                core.CaseUpdate(model.Id, fieldValueList, checkListValueList);
                core.CaseUpdateFieldValues(model.Id);
                return new OperationResult(true, _localizationService.GetString("CaseHasBeenUpdated"));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("CaseCouldNotBeUpdated"));
            }
        }
    }
}
using System;
using System.Collections.Generic;
using eFormAPI.Common.Infrastructure;
using eFormAPI.Common.Infrastructure.Helpers;
using eFormAPI.Common.Infrastructure.Models.API;
using eFormAPI.Common.Models.Cases.Request;
using eFormAPI.Common.Models.Cases.Response;
using eFormAPI.Core.Helpers;
using eFormData;
using eFormShared;

namespace eFormAPI.Core.Services
{
    public class CasesService : ICasesService
    {
         private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();
        
        public OperationDataResult<CaseListModel> Index(CaseRequestModel requestModel)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var caseList = core.CaseReadAll(requestModel.TemplateId, null, null,
                    Constants.WorkflowStates.NotRemoved, requestModel.NameFilter,
                    requestModel.IsSortDsc, requestModel.Sort);
                var model = new CaseListModel()
                {
                    NumOfElements = 40,
                    PageNum = requestModel.PageIndex,
                    Cases = caseList
                };

                return new OperationDataResult<CaseListModel>(true, model);
            }
            catch (Exception)
            {
                return new OperationDataResult<CaseListModel>(false, LocaleHelper.GetString("CaseLoadingFailed"));
            }
        }

        public OperationDataResult<ReplyElement> Edit(int id)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var caseDto = core.CaseReadByCaseId(id);
                var microtingUId = caseDto.MicrotingUId;
                var microtingCheckUId = caseDto.CheckUId;
                var theCase = core.CaseRead(microtingUId, microtingCheckUId);
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
                var core = _coreHelper.GetCore();

                return core.CaseDeleteResult(id)
                    ? new OperationResult(true, LocaleHelper.GetString("CaseParamDeletedSuccessfully", id))
                    : new OperationResult(false, LocaleHelper.GetString("CaseCouldNotBeRemoved"));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("CaseCouldNotBeRemoved"));
            }
        }

        public OperationResult Update(ReplyRequest model)
        {
            var checkListValueList = new List<string>();
            var fieldValueList = new List<string>();
            var core = _coreHelper.GetCore();
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
                return new OperationResult(false, LocaleHelper.GetString("CaseCouldNotBeUpdated"));
            }
            try
            {
                core.CaseUpdate(model.Id, fieldValueList, checkListValueList);
                core.CaseUpdateFieldValues(model.Id);
                return new OperationResult(true, LocaleHelper.GetString("CaseHasBeenUpdated"));
            }
            catch (Exception)
            {
                return new OperationResult(false, LocaleHelper.GetString("CaseCouldNotBeUpdated"));
            }
        }
    }
}

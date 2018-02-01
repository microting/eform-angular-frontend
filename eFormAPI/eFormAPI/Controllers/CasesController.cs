using System;
using System.Collections.Generic;
using System.Web.Http;
using eFormAPI.Common.API;
using eFormAPI.Common.Models.Cases.Request;
using eFormAPI.Web.Infrastructure.Helpers;
using eFormShared;
using eFormData;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class CasesController : ApiController
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

        [HttpGet]
        public OperationDataResult<List<Case>> Index(int id)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var model = core.CaseReadAll(id, null, null);
                return new OperationDataResult<List<Case>>(true, model);
            }
            catch (Exception)
            {
                return new OperationDataResult<List<Case>>(false, "Case loading failed");
            }
        }

        [HttpGet]
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

        [HttpGet]
        public OperationResult Delete(int id)
        {
            try
            {
                var core = _coreHelper.GetCore();

                return core.CaseDeleteResult(id)
                    ? new OperationResult(true, $"Case #{id} deleted successfully")
                    : new OperationResult(false, "Case could not be removed");
            }
            catch (Exception)
            {
                return new OperationResult(false, "Case could not be removed");
            }
        }

        [HttpPost]
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
            catch (Exception exception)
            {
                return new OperationResult(false, "Case could not be updated");
            }
            try
            {
                core.CaseUpdate(model.Id, fieldValueList, checkListValueList);
                core.CaseUpdateFieldValues(model.Id);
                return new OperationResult(true, "Case has been updated");
            }
            catch (Exception)
            {
                return new OperationResult(false, "Case could not be updated");
            }
        }
    }
}
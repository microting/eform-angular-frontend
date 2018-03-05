using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using eFormAPI.Web.Infrastructure.Helpers;
using eFormAPI.Web.Infrastructure.Models.API;
using eFormAPI.Web.Infrastructure.Models.Templates;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class TemplateColumnsController : ApiController
    {
        private readonly EFormCoreHelper _coreHelper = new EFormCoreHelper();

        [HttpGet]
        [Route("api/template-columns/{templateId}")]
        public OperationDataResult<List<TemplateColumnModel>> GetAvailableColumns(int templateId)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var fields = core.Advanced_TemplateFieldReadAll(templateId);
                List<TemplateColumnModel> templateColumns = new List<TemplateColumnModel>();
                foreach (var field in fields)
                {
                    if (field.FieldType != "Picture" 
                        && field.FieldType != "Audio" 
                        && field.FieldType != "Movie"
                        && field.FieldType != "Signature"
                        && field.FieldType != "SaveButton")
                    templateColumns.Add(new TemplateColumnModel()
                    {
                        Id = field.Id,
                        Label = field.Label
                    });
                }
                //List<TemplateColumnModel> templateColumns = fields.Select(field => new TemplateColumnModel()
                //    {
                //        Id = field.id,
                //        Label = field.label
                //    })
                //    .ToList();
                return new OperationDataResult<List<TemplateColumnModel>>(true, templateColumns);
            }
            catch (Exception)
            {
                return new OperationDataResult<List<TemplateColumnModel>>(false, "Error while obtaining columns");
            }
        }
        
        [HttpGet]
        [Route("api/template-columns/current/{templateId}")]
        public OperationDataResult<DisplayTemplateColumnsModel> GetCurrentColumns(int templateId)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var template = core.TemplateItemRead(templateId);
                var model = new DisplayTemplateColumnsModel()
                {
                    TemplateId = template.Id,
                    FieldId1 = template.Field1?.Id,
                    FieldId2 = template.Field2?.Id,
                    FieldId3 = template.Field3?.Id,
                    FieldId4 = template.Field4?.Id,
                    FieldId5 = template.Field5?.Id,
                    FieldId6 = template.Field6?.Id,
                    FieldId7 = template.Field7?.Id,
                    FieldId8 = template.Field8?.Id,
                    FieldId9 = template.Field9?.Id,
                    FieldId10 = template.Field10?.Id
                };
                
                return new OperationDataResult<DisplayTemplateColumnsModel>(true, model);
            }
            catch (Exception)
            {
                return new OperationDataResult<DisplayTemplateColumnsModel>(false, "Error while obtaining columns");
            }
        }
        
        [HttpPost]
        [Route("api/template-columns")]
        public OperationResult UpdateColumns(UpdateTemplateColumnsModel model)
        {
            try
            {
                var core = _coreHelper.GetCore();
                var columnsList = new List<int?>
                {
                    model.FieldId1,
                    model.FieldId2,
                    model.FieldId3,
                    model.FieldId4,
                    model.FieldId5,
                    model.FieldId6,
                    model.FieldId7,
                    model.FieldId8,
                    model.FieldId9,
                    model.FieldId10
                };
                columnsList = columnsList.OrderBy(x => x == null).ToList();
                var columnsUpdateResult = core.Advanced_TemplateUpdateFieldIdsForColumns((int)model.TemplateId, 
                    columnsList[0], columnsList[1], columnsList[2], columnsList[3], 
                    columnsList[4], columnsList[5], columnsList[6], columnsList[7], 
                    columnsList[8], columnsList[9]);
                var allCases = core.CaseReadAll(model.TemplateId, null, null);
                foreach (var caseObject in allCases)
                {
                    core.CaseUpdateFieldValues(caseObject.Id);
                }
                return columnsUpdateResult 
                    ? new OperationResult(true, "Columns was updated") 
                    : new OperationResult(false, "Error while updating columns");
            }
            catch (Exception)
            {
                return new OperationResult(false, "Error while updating columns");
            }
        }
    }
}
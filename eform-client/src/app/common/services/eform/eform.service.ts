import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  DeployModel,
  EFormCreateModel,
  EformDownloadExcelModel,
  OperationDataResult,
  OperationResult,
  TemplateColumnModel,
  TemplateDto,
  TemplateListModel,
  FieldDto,
  UpdateColumnsModel,
  TemplateRequestModel,
  CommonDictionaryModel,
} from 'src/app/common/models';
import { ApiBaseService } from 'src/app/common/services';

const TemplatesMethods = {
  GetAll: '/api/templates/index',
  GetSingle: '/api/templates/get',
  GetFields: '/api/templates/get-fields',
  DeleteSingle: '/api/templates/delete',
  CreateSingle: '/api/templates/create',
  DeploySingle: '/api/templates/deploy',
  ImportEforms: '/api/templates/import',
  CommonDictionaryModelTemplates: 'api/templates/common-dictionary-templates',
  Duplicate: 'api/templates/duplicate',
};

const TemplateFilesMethods = {
  GetCsv: '/api/template-files/csv',
  DownloadXML: '/api/template-files/download-eform-xml',
  DownloadExcel: '/api/template-files/download-eform-excel',
  DownloadPDF: '/api/template-files/download-case-pdf',
};

const TemplateColumnMethods = {
  GetColumns: '/api/template-columns',
};

@Injectable()
export class EFormService {
  private apiBaseService = inject(ApiBaseService);


  getAll(
    model: TemplateRequestModel
  ): Observable<OperationDataResult<TemplateListModel>> {
    return this.apiBaseService.post(TemplatesMethods.GetAll, model);
  }

  getSingle(id: number): Observable<OperationDataResult<TemplateDto>> {
    return this.apiBaseService.get<TemplateDto>(
      TemplatesMethods.GetSingle + '/' + id
    );
  }

  deleteSingle(id: number): Observable<OperationResult> {
    return this.apiBaseService.delete(TemplatesMethods.DeleteSingle + '/' + id);
  }

  createSingle(eFormXmlModel: EFormCreateModel): Observable<OperationResult> {
    return this.apiBaseService.post(
      TemplatesMethods.CreateSingle,
      eFormXmlModel
    );
  }

  deploySingle(deployModel: DeployModel): Observable<OperationResult> {
    return this.apiBaseService.post(TemplatesMethods.DeploySingle, deployModel);
  }

  getFields(id: number): Observable<OperationDataResult<FieldDto[]>> {
    return this.apiBaseService.get<FieldDto[]>(
      TemplatesMethods.GetFields + '/' + id
    );
  }

  getTemplateColumns(
    templateId: number
  ): Observable<OperationDataResult<Array<TemplateColumnModel>>> {
    return this.apiBaseService.get<Array<TemplateColumnModel>>(
      TemplateColumnMethods.GetColumns + '/' + templateId
    );
  }

  getCurrentTemplateColumns(
    templateId: number
  ): Observable<OperationDataResult<UpdateColumnsModel>> {
    return this.apiBaseService.get<UpdateColumnsModel>(
      TemplateColumnMethods.GetColumns + '/current/' + templateId
    );
  }

  updateTemplateColumns(
    model: UpdateColumnsModel
  ): Observable<OperationResult> {
    return this.apiBaseService.post(TemplateColumnMethods.GetColumns, model);
  }

  downloadEformXML(templateId: number): Observable<any> {
    return this.apiBaseService.getBlobData(
      TemplateFilesMethods.DownloadXML + '/' + templateId
    );
  }

  downloadEformPDF(
    templateId: number,
    caseId: number,
    fileType: string
  ): Observable<any> {
    return this.apiBaseService.getBlobData(
      TemplateFilesMethods.DownloadPDF +
        '/' +
        templateId +
        '/?caseId=' +
        caseId +
        '&fileType=' +
        fileType
    );
  }

  downloadEformExcel(model: EformDownloadExcelModel): Observable<any> {
    return this.apiBaseService.getBlobData(
      TemplateFilesMethods.DownloadExcel,
      model
    );
  }

  downloadCSVFile(templateId: number): Observable<any> {
    return this.apiBaseService.getBlobData(
      TemplateFilesMethods.GetCsv +
        '/' +
        templateId +
        '?start=&end=&utcTime=false&gpsCoordinates=false&includeCheckListText=true'
    );
  }

  getTemplatesDictionary(
    nameFilter: string,
    idFilter = 0
  ): Observable<OperationDataResult<CommonDictionaryModel[]>> {
    return this.apiBaseService.get<CommonDictionaryModel[]>(
      TemplatesMethods.CommonDictionaryModelTemplates,
      { nameFilter: nameFilter, idFilter: idFilter }
    );
  }

  // importEFormsFromExcel(excelFile: File): Observable<OperationResult> {
  //   return this.apiBaseService.uploadFile(TemplatesMethods.ImportEforms, excelFile);
  // }

  duplicateEForms(templateId: number): Observable<OperationResult> {
    return this.apiBaseService.post(TemplatesMethods.Duplicate, { templateId });
  }
}

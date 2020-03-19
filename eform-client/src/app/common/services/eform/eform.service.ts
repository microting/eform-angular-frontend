import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  DeployModel,
  EFormCreateModel,
  OperationDataResult,
  OperationResult, TemplateColumnModel,
  TemplateDto,
  TemplateListModel, UpdateColumnsModel
} from 'src/app/common/models';
import {TemplateRequestModel} from 'src/app/common/models/eforms';
import {BaseService} from 'src/app/common/services/base.service';
import {FieldDto} from '../../models/dto/field.dto';

const TemplatesMethods = {
  GetAll: '/api/templates/index',
  GetSingle: '/api/templates/get',
  GetFields: '/api/templates/get-fields',
  DeleteSingle: '/api/templates/delete',
  CreateSingle: '/api/templates/create',
  DeploySingle: '/api/templates/deploy',
};

const TemplateFilesMethods = {
  GetCsv: '/api/template-files/csv',
  DownloadXML: '/api/template-files/download-eform-xml',
  DownloadPDF: '/api/template-files/download-case-pdf'
};

const TemplateColumnMethods = {
  GetColumns: '/api/template-columns'
};

@Injectable()
export class EFormService extends BaseService {
  constructor(private _http: HttpClient, router: Router, toastrService: ToastrService) {
    super(_http, router, toastrService);
  }

  getAll(model: TemplateRequestModel): Observable<OperationDataResult<TemplateListModel>> {
    return this.post(TemplatesMethods.GetAll, model);
  }

  getSingle(id: number): Observable<OperationDataResult<TemplateDto>> {
    return this.get<TemplateDto>(TemplatesMethods.GetSingle + '/' + id);
  }

  deleteSingle(id: number): Observable<OperationResult> {
    return this.get(TemplatesMethods.DeleteSingle + '/' + id);
  }

  createSingle(eFormXmlModel: EFormCreateModel): Observable<OperationResult> {
    return this.post(TemplatesMethods.CreateSingle, eFormXmlModel);
  }

  deploySingle(deployModel: DeployModel): Observable<OperationResult> {
    return this.post(TemplatesMethods.DeploySingle, deployModel);
  }

  getFields(id: number): Observable<OperationDataResult<FieldDto[]>> {
    return this.get<FieldDto[]>(TemplatesMethods.GetFields + '/' + id);
  }

  getTemplateColumns(templateId: number): Observable<OperationDataResult<Array<TemplateColumnModel>>> {
    return this.get<Array<TemplateColumnModel>>(TemplateColumnMethods.GetColumns + '/' + templateId);
  }

  getCurrentTemplateColumns(templateId: number): Observable<OperationDataResult<UpdateColumnsModel>> {
    return this.get<UpdateColumnsModel>(TemplateColumnMethods.GetColumns + '/current/' + templateId);
  }

  updateTemplateColumns(model: UpdateColumnsModel): Observable<OperationResult> {
    return this.post(TemplateColumnMethods.GetColumns, model);
  }

  downloadEformXML(templateId: number): Observable<any> {
    return this.getBlobData(TemplateFilesMethods.DownloadXML + '/' + templateId);
  }

  downloadEformPDF(templateId: number, caseId: number, fileType: string): Observable<any> {
    return this.getBlobData(TemplateFilesMethods.DownloadPDF + '/' + templateId + '/?caseId=' + caseId + '&fileType=' + fileType);
  }

  downloadCSVFile(templateId: number): Observable<any> {
    return this.getBlobData(TemplateFilesMethods.GetCsv + '/' + templateId);
  }
}

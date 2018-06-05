import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {OperationDataResult, OperationResult, TemplatesMethods} from '../../modules/helpers/helpers.module';
import {BaseService} from '../base.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';

import {DeployModel, EFormCreateModel, TemplateDto,
  TemplateColumnModel, UpdateColumnsModel, TemplateListModel, TemplateRequestModel} from 'app/models';
import {TemplateColumnMethods, TemplateFilesMethods} from 'app/modules/helpers/app.constants';

@Injectable()
export class EFormService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  getAll(model: TemplateRequestModel): Observable<OperationDataResult<TemplateListModel>> {
    return this.postModelOperationDataResult(TemplatesMethods.GetAll, model);
  }

  getSingle(id: number): Observable<OperationDataResult<TemplateDto>> {
    return this.getWithOperationDataResult<TemplateDto>(TemplatesMethods.GetSingle + '/' + id);
  }

  deleteSingle(id: number): Observable<OperationResult> {
    return this.getWithOperationResult(TemplatesMethods.DeleteSingle + '/' + id);
  }

  createSingle(eFormXmlModel: EFormCreateModel): Observable<OperationResult> {
    return this.postModelOperationResult(TemplatesMethods.CreateSingle, eFormXmlModel);
  }

  deploySingle(deployModel: DeployModel): Observable<OperationResult> {
    return this.postModelOperationResult(TemplatesMethods.DeploySingle, deployModel);
  }

  getTemplateColumns(templateId: number): Observable<OperationDataResult<Array<TemplateColumnModel>>> {
    return this.getWithOperationDataResult<Array<TemplateColumnModel>>(TemplateColumnMethods.GetColumns + '/' + templateId);
  }

  getCurrentTemplateColumns(templateId: number): Observable<OperationDataResult<UpdateColumnsModel>> {
    return this.getWithOperationDataResult<UpdateColumnsModel>(TemplateColumnMethods.GetColumns + '/current/' + templateId);
  }

  updateTemplateColumns(model: UpdateColumnsModel): Observable<OperationResult> {
    return this.postModelOperationResult(TemplateColumnMethods.GetColumns, model);
  }

  downloadEformXML(templateId: number): Observable<OperationDataResult<any>> {
    return this.getWithOperationDataResult<any>(TemplateFilesMethods.DownloadXML + '/' + templateId);
  }

  downloadEformPDF(templateId: number, caseId: number): Observable<OperationDataResult<any>> {
    return this.getWithOperationDataResult<any>(TemplateFilesMethods.DownloadPDF + '/' + templateId + '?caseId=' + caseId);
  }
}

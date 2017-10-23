import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {OperationDataResult, OperationResult, TemplatesMethods} from '../../modules/helpers/helpers.module';
import {BaseService} from '../base.service';
import {TemplateDto} from '../../models';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Router} from '@angular/router';
import {DeployModel, EFormXmlModel} from 'app/models/eFormTemplates';
import {TemplateColumnModel} from '../../models/cases/response/column-field.model';
import {TemplateColumnMethods, TemplateFilesMethods} from '../../modules/helpers/app.constants';
import {UpdateColumnsModel} from '../../models/cases/request/update-columns.model';

@Injectable()
export class EFormService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http, router: Router) {
    super(_http, router);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public getAll = (): Observable<OperationDataResult<Array<TemplateDto>>> => {
    return this.getWithOperationDataResult<Array<TemplateDto>>(TemplatesMethods.GetAll);
  }

  public getSingle = (id: number): Observable<OperationDataResult<TemplateDto>> => {
    return this.getWithOperationDataResult<TemplateDto>(TemplatesMethods.GetSingle + '/' + id);
  }

  public deleteSingle = (id: number): Observable<OperationResult> => {
    return this.getWithOperationResult(TemplatesMethods.DeleteSingle + '/' + id);
  }

  public createSingle = (eFormXmlModel: EFormXmlModel): Observable<OperationResult> => {
    return this.postModelOperationResult(TemplatesMethods.CreateSingle, eFormXmlModel);
  }

  public deploySingle = (deployModel: DeployModel): Observable<OperationResult> => {
    return this.postModelOperationResult(TemplatesMethods.DeploySingle, deployModel);
  }

  public getTemplateColumns = (templateId: number): Observable<OperationDataResult<Array<TemplateColumnModel>>> => {
    return this.getWithOperationDataResult<Array<TemplateColumnModel>>(TemplateColumnMethods.GetColumns + '/' + templateId);
  }

  public getCurrentTemplateColumns = (templateId: number): Observable<OperationDataResult<UpdateColumnsModel>> => {
    return this.getWithOperationDataResult<UpdateColumnsModel>(TemplateColumnMethods.GetColumns + '/current/' + templateId);
  }

  public updateTemplateColumns = (model: UpdateColumnsModel): Observable<OperationResult> => {
    return this.postModelOperationResult(TemplateColumnMethods.GetColumns, model);
  }

  public downloadEformXML = (templateId: number): Observable<OperationDataResult<any>> => {
    return this.getWithOperationDataResult<any>(TemplateFilesMethods.DownloadXML + '/' + templateId);
  }

  public downloadEformPDF = (templateId: number, caseId: number): Observable<OperationDataResult<any>> => {
    return this.getWithOperationDataResult<any>(TemplateFilesMethods.DownloadPDF + '/' + templateId + '?caseId=' + caseId);
  }
}

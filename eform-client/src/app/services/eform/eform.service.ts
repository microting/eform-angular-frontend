import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {OperationDataResult, OperationResult, TemplatesMethods} from '../../modules/helpers/helpers.module';
import {BaseService} from '../base.service';
import {TemplateDto} from '../../models';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {EFormXmlModel} from '../../models/eFormTemplates/eform-xml.model';
import {DeployModel} from '../../models/eFormTemplates/deploy.model';

@Injectable()
export class EFormService extends BaseService {
  private headers: Headers;

  constructor(private _http: Http) {
    super(_http);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public getAll = (): Observable<OperationDataResult<Array<TemplateDto>>> => {
    return this.getWithOperationDataResult<Array<TemplateDto>>(TemplatesMethods.GetAll);
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
}

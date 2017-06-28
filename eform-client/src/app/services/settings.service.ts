import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import {OperationResult, SettingsMethods} from '../modules/helpers/helpers.module';
import {BaseService} from './base.service';
import {ConnectionStringModel} from '../models/settings/connection-string.model';

@Injectable()
export class SettingsService extends BaseService {


  private headers: Headers;

  constructor(private _http: Http) {
    super(_http);
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public updateConnectionString = (model: ConnectionStringModel): Observable<OperationResult> => {
    return this.postModelOperationResult<ConnectionStringModel>(SettingsMethods.UpdateConnectionString, model);
  }
}

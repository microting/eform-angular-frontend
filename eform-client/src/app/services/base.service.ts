import {Headers, Http, Response} from '@angular/http';
import {Router} from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

import {AuthResponseModel} from 'app/models/auth';
import {NotifyService} from 'app/services/notify.service';
import {OperationDataResult, OperationResult} from '../modules/helpers/operation.models';

export class BaseService {
  constructor(private http: Http, private router: Router) {
  }

  get<T>(method: string): Observable<T> {
    return this.http.get(method, {headers: this.apiHeaders})
      .map(this.extractData)
      .catch(this.handleError);
  }

  post<T>(method: string, body: any): Observable<T> {
    const model = JSON.stringify(body);
    return this.http.post(method, model, {headers: this.apiHeaders})
      .map((response) => this.extractData<T>(response))
      .catch(this.handleError);
  }

  delete<T>(method: string): Observable<T> {
    return this.http.delete(method, {headers: this.apiHeaders})
      .map((response) => this.extractData<T>(response))
      .catch(this.handleError);
  }

  postForm<T>(method: string, body: any): Observable<T> {
    return this.http.post(method, body.toString(), {headers: this.formHeaders})
      .map((response) => this.extractData<T>(response))
      .catch(this.handleError);
  }

  postModel<TIn, TOut>(method: string, body: TIn): Observable<TOut> {
    //  var model = body.toRequestJsonModel();
    return this.http.post(method, body, {headers: this.apiHeaders})
      .map((response) => this.extractData<TOut>(response))
      .catch(this.handleError);
  }

  getWithOperationResult(method: string): Observable<OperationResult> {
    return this.get<OperationResult>(method);
  }

  getWithOperationDataResult<T>(method: string): Observable<OperationDataResult<T>> {
    return this.get<OperationDataResult<T>>(method);
  }

  postModelOperationResult<TIn>(method: string, model: TIn): Observable<OperationResult> {
    return this.postModel<TIn, OperationResult>(method, model);
  }

  postModelOperationDataResult<TIn, TOut>(method: string, model: TIn): Observable<OperationDataResult<TOut>> {
    return this.postModel<TIn, OperationDataResult<TOut>>(method, model);
  }

  private get apiHeaders() {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const user: AuthResponseModel = JSON.parse(localStorage.getItem('currentAuth'));
    // check user
    if (user && user.access_token) {
      headers.append('Authorization', 'Bearer ' + user.access_token);
    }
    return headers;
  }

  private get formHeaders() {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const user: AuthResponseModel = JSON.parse(localStorage.getItem('currentAuth'));
    // check user
    if (user && user.access_token) {
      headers.append('Authorization', 'Bearer ' + user.access_token);
    }
    return headers;
  }

  private extractData<T>(res: Response) {
    const body = res.json();
    return <T>body || {};
  }

  private logOutWhenTokenFalse() {
    localStorage.clear();
    this.router.navigate(['/login']).then();
  }


  handleError(error: Response | any) {
    let errMsg = '';
    const notify = new NotifyService();

    // Handle 403 - Forbriden
    if (error.status === 403) {
      errMsg = '403 - Invalid connection string';
      notify.error({text: errMsg});
      console.error(errMsg);
      window.location.href = '/settings/connection-string';
    }

// Handle 403 - Unauthorized
    if (error.status === 401) {
      errMsg = '401 - Invalid auth';
      notify.error({text: errMsg});
      console.error(errMsg);
      localStorage.clear();
      window.location.href = '/login';
    }

    try {
      if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        notify.error({text: errMsg});
        return Observable.throw(errMsg);
      }
    }
    catch (e) {
      console.log(e.message);
      errMsg = e.message || '';
      notify.error({text: 'Request error: ' + errMsg});
      return Observable.throw(errMsg);
    }
  }
}

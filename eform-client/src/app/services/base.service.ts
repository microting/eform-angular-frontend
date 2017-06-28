import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {OperationDataResult, OperationResult} from '../modules/helpers/operation.models';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {NotifyService} from 'app/modules/helpers/helpers.module';

export class BaseService {
  private baseHeaders: Headers;
  private formOptions: RequestOptions;
  private baseOptions: RequestOptions;

  constructor(private http: Http) {
    this.baseHeaders = new Headers();
    this.baseHeaders.append('Content-Type', 'application/json');
    this.baseHeaders.append('Accept', 'application/json');
    const formHeaders = new Headers();
    formHeaders.append('Content-Type', 'x-www-url-formencoded');
    formHeaders.append('Accept', 'x-www-url-formencoded');
    this.formOptions = new RequestOptions(formHeaders);
    this.baseOptions = new RequestOptions({headers: this.baseHeaders});
  }

  addHeader(key: any, value: any) {
    this.baseHeaders.append(key, value);
    this.baseOptions = new RequestOptions(this.baseHeaders);
  }

  get<T>(method: string): Observable<T> {
    return this.http.get(method, this.baseOptions)
      .map(this.extractData)
      .catch(this.handleError);
  }

  post<T>(method: string, body: any): Observable<T> {
    const model = JSON.stringify(body);
    return this.http.post(method, model, this.baseOptions)
      .map((response) => this.extractData<T>(response))
      .catch(this.handleError);
  }

  postModel<TIn, TOut>(method: string, body: TIn): Observable<TOut> {
    //  var model = body.toRequestJsonModel();
    return this.http.post(method, body, this.baseOptions)
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

  private extractData<T>(res: Response) {
    const body = res.json();
    return <T>body || {};
  }

  handleError(error: Response | any) {
    let errMsg = '';
    const notify = new NotifyService();

    // Handle 401 - Unauthorized
    if (error.status === 401) {
      errMsg = '401 - Invalid connection string';
      notify.error({text: errMsg});
      console.error(errMsg);
      window.location.href = '/settings/connection-string';
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

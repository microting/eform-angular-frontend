import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import * as R from 'ramda';
import {selectAuthIsAuth, selectBearerToken} from 'src/app/state';
import {Store} from '@ngrx/store';

@Injectable()
export class ApiBaseService {
  private selectBearerToken$ = this.authStore.select(selectBearerToken);
  private selectAuthIsAuth$ = this.authStore.select(selectAuthIsAuth);
  private currentBearerToken: string = '';
  private isAuth: boolean = false;

  constructor(
    private http: HttpClient,
    private authStore: Store,
    private toastrService: ToastrService,
  ) {
    this.selectBearerToken$.subscribe(x => this.currentBearerToken = x);
    this.selectAuthIsAuth$.subscribe(x => this.isAuth = x);
  }

  public static objectToFormData(
    object: Object,
    needPascalStyle = false,
    form?: FormData,
    namespace?: string
  ): FormData {
    const formData = form || new FormData();
    // eslint-disable-next-line guard-for-in
    for (const property in object) {
      const changedNameProperty = needPascalStyle
        ? property[0].toUpperCase() + R.drop(1, property)
        : property;
      const formKey = namespace
        ? `${namespace}[${changedNameProperty}]`
        : changedNameProperty;
      // if (object[property] === null) {
      //   formData.append(formKey, null);
      //   continue;
      // }
      if (object[property] instanceof Date) {
        formData.append(formKey, object[property].toISOString());
      } else if (
        typeof object[property] === 'object' &&
        !(object[property] instanceof File)
      ) {
        ApiBaseService.objectToFormData(
          object[property],
          needPascalStyle,
          formData,
          formKey
        );
      } else if (object[property] instanceof File) {
        const file = object[property] as File;
        // formData.append(
        //   formKey,
        //   new Blob([file], { type: 'application/pdf' }),
        //   file.name
        // );
        formData.append(formKey, file, file.name);
      } else {
        formData.append(formKey, object[property]);
      }
    }
    return formData;
  }

  public get<T>(method: string, params?: any): Observable<any> {
    return this.http
      .get(method, {
        headers: this.setHeaders(),
        params: ApiBaseService.setParams(params),
      })
      .pipe(map((response) => this.extractData<T>(response)));
  }

  public getNoToast<T>(method: string, params?: any): Observable<any> {
    return this.http
      .get(method, {
        headers: this.setHeaders(),
        params: ApiBaseService.setParams(params),
      })
      .pipe(map((response) => this.extractDataNoToast<T>(response)));
  }

  public post<T>(method: string, body: any): Observable<any> {
    const model = JSON.stringify(body);
    return this.http
      .post(method, model, {headers: this.setHeaders()})
      .pipe(map((response) => this.extractData<T>(response)));
  }

  public postUrlEncoded<T>(method: string, body: any): Observable<any> {
    return this.http
      .post(method, body.toString(), {
        headers: this.setHeaders('application/x-www-form-urlencoded'),
      })
      .pipe(map((response) => this.extractData<T>(response)));
  }

  public postFormData<T>(url: string, body: any): Observable<any> {
    const formData = ApiBaseService.objectToFormData(body, true);
    return this.http
      .post(url, formData, {
        headers: this.setHeaders('formData'),
      })
      .pipe(map((response) => this.extractData<T>(response)));
  }

  public putFormData<T>(url: string, body: any): Observable<any> {
    const formData = ApiBaseService.objectToFormData(body, true);
    return this.http
      .put(url, formData, {
        headers: this.setHeaders('formData'),
      })
      .pipe(map((response) => this.extractData<T>(response)));
  }

  public delete<T>(method: string, params?: any): Observable<any> {
    return this.http
      .delete(method, {
        headers: this.setHeaders(),
        params: ApiBaseService.setParams(params),
      })
      .pipe(map((response) => this.extractData<T>(response)));
  }

  public put<T>(method: string, body: any): Observable<any> {
    const model = JSON.stringify(body);
    return this.http
      .put(method, model, {headers: this.setHeaders()})
      .pipe(map((response) => this.extractData<T>(response)));
  }

  public getBlobData<T>(method: string, params?: any): Observable<any> {
    return this.http
      .get(method, {
        headers: this.setHeaders(),
        params: ApiBaseService.setParams(params),
        responseType: 'blob',
      });
  }

  // post request for get blob file
  public postBlobData<T>(method: string, body?: any): Observable<any> {
    return this.http
      .post(method, JSON.stringify(body), {
        headers: this.setHeaders(),
        responseType: 'blob',
      });
  }

  public uploadFiles<T>(
    method: string,
    files: any[],
    params?: any,
    responseType?: any
  ): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(`files`, files[i]);
    }
    return this.http
      .post(method, formData, {
        headers: this.setHeaders('formData'),
        params: ApiBaseService.setParams(params),
        responseType: responseType,
      })
      .pipe(
        map((response) => response),
        catchError((err) => throwError(err))
      );
  }

  public uploadFile<T>(
    method: string,
    file: any,
    params?: any,
    responseType?: any
  ): Observable<any> {
    const formData = new FormData();
    formData.append(`file`, file);
    return this.http
      .post(method, formData, {
        headers: this.setHeaders('formData'),
        params: ApiBaseService.setParams(params),
        responseType: responseType,
      })
      .pipe(
        map((response) => response),
        catchError((err) => throwError(err))
      );
  }

  private setHeaders(contentType?: string) {
    let headers = new HttpHeaders();
    if (contentType === 'formData') {
      // headers = headers.set('Content-Type', 'multipart/form-data');
      // if you uncomment this piece of code, the FormData will not be read correctly on the server
      // due to the lack of a 'boundary' (separator), which is installed independently and randomly
    } else if (contentType) {
      headers = headers.set('Content-Type', contentType);
    } else {
      headers = headers.set('Content-Type', 'application/json');
    }

    if (this.isAuth && this.currentBearerToken) {
      headers = headers.set('Authorization', `Bearer ${this.currentBearerToken}`);
    }
    return headers;
  }

  private static setParams(params: any) {
    let httpParams = new HttpParams();
    if (!params) {
      return httpParams;
    }
    for (const param of Object.keys(params)) {
      if (params[param] === 0 || R.isNotNil(params[param])) {
        httpParams = httpParams.set(param, params[param]);
      }
    }
    return httpParams;
  }

  private extractData<T>(res: any) {
    let body;
    try {
      body = res;
      if (body && body.success && body.message && body.message !== 'Success') {
        this.toastrService.success(body.message);
      } else if (body && !body.success && body.message) {
        this.toastrService.error(body.message);
      }
    } catch (e) {
      return {};
    }
    return <T>body || {};
  }

  private extractDataNoToast<T>(res: any) {
    let body;
    try {
      body = res;
      if (body && body.success && body.message && body.message !== 'Success') {
        //this.toastrService.success(body.message);
      } else if (body && !body.success && body.message) {
        //this.toastrService.error(body.message);
      }
    } catch (e) {
      return {};
    }
    return <T>body || {};
  }
}

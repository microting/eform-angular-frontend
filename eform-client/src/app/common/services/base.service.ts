import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class BaseService {
  constructor(
    private http: HttpClient,
    public router: Router,
    private toastrService: ToastrService
  ) {}

  public get<T>(method: string, params?: any): Observable<any> {
    return this.http
      .get(method, {
        headers: this.setHeaders(),
        params: this.setParams(params),
      })
      .pipe(map((response) => this.extractData<T>(response)));
  }

  public post<T>(method: string, body: any): Observable<any> {
    const model = JSON.stringify(body);
    return this.http
      .post(method, model, { headers: this.setHeaders() })
      .pipe(map((response) => this.extractData<T>(response)));
  }

  public postUrlEncoded<T>(method: string, body: any): Observable<any> {
    return this.http
      .post(method, body.toString(), {
        headers: this.setHeaders('application/x-www-form-urlencoded'),
      })
      .pipe(map((response) => this.extractData<T>(response)));
  }

  public delete<T>(method: string): Observable<any> {
    return this.http
      .delete(method, { headers: this.setHeaders() })
      .pipe(map((response) => this.extractData<T>(response)));
  }

  public put<T>(method: string, body: any): Observable<any> {
    const model = JSON.stringify(body);
    return this.http
      .put(method, model, { headers: this.setHeaders() })
      .pipe(map((response) => this.extractData<T>(response)));
  }

  public getBlobData<T>(method: string, params?: any): Observable<any> {
    return this.http
      .get(method, {
        headers: this.setHeaders(),
        params: this.setParams(params),
        responseType: 'blob',
      })
      .pipe(map((response) => response));
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
        params: this.setParams(params),
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
        params: this.setParams(params),
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
    } else if (contentType) {
      headers = headers.set('Content-Type', contentType);
    } else {
      headers = headers.set('Content-Type', 'application/json');
    }
    const token = JSON.parse(localStorage.getItem('token'));
    // check user
    if (token && token.token.accessToken) {
      headers.append('Authorization', 'Bearer ' + token.token.accessToken);
    }
    // add localization
    return headers;
  }

  private setParams(params: any) {
    let httpParams = new HttpParams();
    if (!params) {
      return httpParams;
    }
    for (const param of Object.keys(params)) {
      if (params[param] === 0 || params[param]) {
        httpParams = httpParams.set(param, params[param]);
      }
    }
    return httpParams;
  }

  private get formHeaders() {
    const headers: Headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    const token = JSON.parse(localStorage.getItem('token'));
    // check user
    if (token && token.token.accessToken) {
      headers.append('Authorization', 'Bearer ' + token.token.accessToken);
    }
    return headers;
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
}

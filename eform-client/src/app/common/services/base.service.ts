import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';

import {ToastrService} from 'ngx-toastr';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AuthResponseModel} from 'src/app/common/models/auth';

export class BaseService {
  constructor(private http: HttpClient, private router: Router, private toastrService: ToastrService) {
  }

  protected get<T>(method: string, params?: any): Observable<any> {
    return this.http.get(method,
      { headers: this.setHeaders(), params: this.setParams(params) })
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError(err => this.handleError(err))
      );
  }

  protected post<T>(method: string, body: any): Observable<any> {
    const model = JSON.stringify(body);
    return this.http.post(method, model, { headers: this.setHeaders() })
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError(err => this.handleError(err))
      );
  }

  protected postUrlEncoded<T>(method: string, body: any): Observable<any> {
    return this.http.post(method, body.toString(), { headers: this.setHeaders('application/x-www-form-urlencoded') })
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError(err => this.handleError(err))
      );
  }

  protected delete<T>(method: string): Observable<any> {
    return this.http.delete(method, { headers: this.setHeaders() })
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError(err => this.handleError(err))
      );
  }

  protected put<T>(method: string, body: any): Observable<any> {
    const model = JSON.stringify(body);
    return this.http.put(method, model, { headers: this.setHeaders() })
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError(err => this.handleError(err))
      );
  }

  protected postFormData<T>(method: string, body: any): Observable<any> {
    return this.http.post(method, body, { headers: this.setHeaders('formData') })
      .pipe(
        map((response) => this.extractData<T>(response)),
        catchError(err => this.handleError(err))
      );
  }

  private setHeaders(contentType?: string) {
    let headers = new HttpHeaders();
    if (contentType === 'formData') {} else if (contentType) {
      headers = headers.set('Content-Type', contentType);
    } else {
      headers = headers.set('Content-Type', 'application/json');
    }
    const user: AuthResponseModel = JSON.parse(localStorage.getItem('currentAuth'));
    // check user
    if (user && user.access_token) {
      headers = headers.append('Authorization', 'Bearer ' + user.access_token);
    }
    // add localization
    headers = headers.append('Locale', localStorage.getItem('locale'));
    return headers;
  }

  private setParams(params: any) {
    let httpParams = new HttpParams();
    if (!params) {
      return httpParams;
    }
    for (const param of Object.keys(params)) {
      if (params[param]) {
        httpParams = httpParams.set(param, params[param]);
      }
    }
    return httpParams;
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

  private extractData<T>(res: any) {
    let body;
    try {
      body = res;
      if (body && body.success && body.message !== 'Success') {
        this.toastrService.success(body.message);
      } else if (body && !body.success && body.message) {
        this.toastrService.error(body.message);
      }
    } catch (e) {
      return {};
    }
    return <T>body || {};
  }

  // private extractData<T>(res: Response) {
  //   const body = res.json();
  //   return <T>body || {};
  // }

  private logOutWhenTokenFalse() {
    localStorage.clear();
    this.router.navigate(['/auth/login']).then();
  }


  private handleError(error: Response | any) {
    let errorMessage = '';
    // Handle 401 - Unauthorized
    if (error.status === 400) {
      let errors;
      if (error._body) {
        errors = error._body;
      } else {
        errors = error.error;
      }
      if (errors && errors.length > 0) {
        errors.forEach(errorItem => {
          this.toastrService.error(errorItem.errorMessage, 'Error', {timeOut: 10000});
          console.error(errorItem);
        });
      }
      return throwError(error);
    }
    // Handle 401 - Unauthorized
    if (error.status === 401 || error.status === 403) {
      this.toastrService.warning('401(403) - Invalid token');
      console.error('401(403) - Invalid token');
      this.logOutWhenTokenFalse();
      console.error(error);
      return throwError(errorMessage);
    }
    const body = error._body || '';
    errorMessage = `${error.status} - ${error.statusText || ''} ${body}`;
    console.error(errorMessage);
    this.toastrService.error(errorMessage, 'Error', {timeOut: 10000});
    return throwError(errorMessage);
  }
}

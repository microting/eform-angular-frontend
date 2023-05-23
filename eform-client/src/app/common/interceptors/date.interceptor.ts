import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {parseJSON} from 'date-fns';

@Injectable()
export class DateInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          this.convertToDate(body);
        }
        return event;
      })
    );
  }

  private convertToDate(body: any) {
    if (!body || typeof body !== 'object') {
      return;
    }
    for (const key of Object.keys(body)) {
      const value = body[key];
      // it's reg find date, if date looks like
      // '2023-02-18T03:51:32.3904046+00:00',
      // '2023-02-18T03:50:23.480481'(without time zone) or
      // '2023-02-18T03:50:23.480481Z'
      if (value && typeof value === 'string' && value.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)?/)) {
        body[key] = parseJSON(value);
      } else if (value && typeof value === 'object') {
        this.convertToDate(value);
      }
    }
  }
}

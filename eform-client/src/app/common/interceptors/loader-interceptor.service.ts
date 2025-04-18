import {Injectable} from '@angular/core';
import {
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import {EMPTY, finalize, Observable, throwError} from 'rxjs';
import {LoaderService} from 'src/app/common/services';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
// This is a class for an HTTP interceptor that intercepts HTTP requests and responses
// It implements the HttpInterceptor interface from the @angular/common/http package
export class LoaderInterceptor implements HttpInterceptor {
  // This is an array of HTTP requests that are currently being processed
  private requests: HttpRequest<any>[] = [];

  // This is the constructor for the class
  // It takes a LoaderService as a parameter
  constructor(private loaderService: LoaderService) {
  }

  // This method removes a request from the requests array
  // It takes an HttpRequest as a parameter
  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    // This sets the loading state of the loader service based on the number of requests in the array
    this.loaderService.setLoading(this.requests.length > 0);
  }

  // This method intercepts an HTTP request and returns an Observable of the HTTP event
  // It takes an HttpRequest and an HttpHandler as parameters
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // This adds the request to the requests array
    this.requests.push(req);

    // This sets the loading state of the loader service to true
    this.loaderService.setLoading(true);

    // This returns an Observable of the HTTP event
    return next.handle(req)
      .pipe(
        // This tap operator checks if the event is an HttpResponse and removes the request from the requests array if it is
        tap((event) => {
            if (event instanceof HttpResponse) {
              this.removeRequest(req);
            }
          }
        ),
        // This catchError operator removes the request from the requests array and throws an error if there is an error
        catchError((err) => {
          // console.log('Intercept request intercepted. catchError... for user: ', req);
          // console.error(err);
          this.removeRequest(req);
          // return throwError(err);
          return EMPTY;
        }),
        // This finalize operator removes the request from the requests array when the Observable completes
        finalize(() => {
          // console.log('Intercept request intercepted. Finalizing... for user: ', req);
          this.removeRequest(req);
        })
      );
  }
}

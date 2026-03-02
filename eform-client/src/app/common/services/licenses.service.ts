import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LicensesService {
  private http = inject(HttpClient);

  fetchLicenseText(licenseUrl: string): Observable<string> {
    const params = new HttpParams().set('url', licenseUrl);
    return this.http.get('/api/licenses/fetch', { 
      params,
      responseType: 'text' 
    });
  }
}

import { Pipe, PipeTransform, inject } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthStateService} from 'src/app/common/store';
import {selectBearerToken} from 'src/app/state/auth/auth.selector';
import {Store} from '@ngrx/store';

@Pipe({
    name: 'authAudio',
    standalone: false
})
export class AuthAudioPipe implements PipeTransform {
  private http = inject(HttpClient);
  private authStore = inject(Store);
  private authStateService = inject(AuthStateService);

  private selectBearerToken$ = this.authStore.select(selectBearerToken);

  async transform(src: string): Promise<any> {
    let token = '';
    this.selectBearerToken$.subscribe((bearerToken) => (token = bearerToken));
    const headers = new HttpHeaders({ Authorization: token });
    const imageBlob = await this.http
      .get(src, { headers, responseType: 'blob' })
      .toPromise();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(imageBlob);
    });
  }
}

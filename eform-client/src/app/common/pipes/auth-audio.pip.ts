import {Pipe, PipeTransform} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthStateService} from 'src/app/common/store';
import {selectBearerToken} from 'src/app/state/auth/auth.selector';
import {Store} from '@ngrx/store';

@Pipe({
  name: 'authAudio',
})
export class AuthAudioPipe implements PipeTransform {
  private selectBearerToken$ = this.authStore.select(selectBearerToken);
  constructor(
    private http: HttpClient,
    private authStore: Store,
    private authStateService: AuthStateService
  ) {}

  async transform(src: string): Promise<any> {
    let token = '';
    this.selectBearerToken$.subscribe((bearerToken) => (token = bearerToken));
    const headers = new HttpHeaders({ Authorization: token });
    const imageBlob = await firstValueFrom(this.http
      .get(src, { headers, responseType: 'blob' }));
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(imageBlob);
    });
  }
}

import {Pipe, PipeTransform} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthStateService} from 'src/app/common/store';
import {firstValueFrom} from 'rxjs';

@Pipe({
  name: 'authAudio',
})
export class AuthAudioPipe implements PipeTransform {
  constructor(
    private http: HttpClient,
    private authStateService: AuthStateService
  ) {}

  async transform(src: string): Promise<any> {
    const token = this.authStateService.bearerToken;
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

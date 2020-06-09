import {Pipe, PipeTransform} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from 'src/app/common/services';


@Pipe({
  name: 'authImage'
})
export class AuthImagePipe implements PipeTransform {

  constructor(
    private http: HttpClient,
    private auth: AuthService, // our service that provides us with the authorization token
  ) {}

  async transform(src: string): Promise<string> {
    const token = this.auth.bearerToken;
    const headers = new HttpHeaders({'Authorization': token});
    const imageBlob = await this.http.get(src, {headers, responseType: 'blob'}).toPromise();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(imageBlob);
    });
  }
}

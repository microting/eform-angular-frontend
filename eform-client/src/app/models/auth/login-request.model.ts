export class LoginRequestModel {
  username: string;
  password: string;
  code: string;
  grant_type = 'password';

  constructor(data?: any) {
    this.username = data.username;
    this.password = data.password;
    if (data.code) {
      this.code = data.code;
    }
  }
}

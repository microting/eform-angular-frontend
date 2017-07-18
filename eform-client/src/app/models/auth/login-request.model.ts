export class LoginRequestModel {
  username: string;
  password: string;
  grant_type = 'password';

  constructor(data?: any) {
    this.username = data.username;
    this.password = data.password;
  }
}

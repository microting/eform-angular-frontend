export class AuthResponseModel {
  access_token: string;
  token_type: string;
  expires_in: number;
  role: string;

  constructor(user: any) {
    this.access_token = user.access_token;
    this.token_type = user.token_type;
    this.expires_in = user.expires_in;
    this.role = user.role;
  }
}

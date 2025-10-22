export class AuthResponseModel {
  accessToken: string;
  tokenType: string;
  expiresIn: Date;
  role: string;
  firstName: string;
  lastName: string;
  userName: string;
  id: number;
  isFirstUser: boolean;
  avatarUrl?: string;

  constructor(user: any) {
    this.accessToken = user.accessToken;
    this.tokenType = user.tokenType;
    this.expiresIn = user.expiresIn;
    this.role = user.role;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.userName = user.userName;
    this.id = user.id;
    this.isFirstUser = user.isFirstUser;
    this.avatarUrl = user.avatalUrl;
  }
}

export class UserInfoModel {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.email = data.email;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
    }
  }
}

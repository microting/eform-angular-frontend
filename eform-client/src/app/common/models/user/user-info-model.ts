export class UserInfoModel {
  id: number;
  createdDate: Date;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  userName: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.email = data.email;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
    }
  }
}

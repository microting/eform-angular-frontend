export class UserInfoModel {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  darkTheme: boolean;
  isDeviceUser: boolean;
  language: string;
  timeZone: string;
  formats: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.email = data.email;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.role = data.role;
      this.darkTheme = data.darkTheme;
      this.isDeviceUser = data.isDeviceUser;
      this.language = data.language;
      this.timeZone = data.timeZone;
      this.formats = data.formats;
    }
  }
}

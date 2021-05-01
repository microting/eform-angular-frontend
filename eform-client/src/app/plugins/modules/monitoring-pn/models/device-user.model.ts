export class DeviceUserModel {
  id: number;
  firstName: string;
  lastName: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
    }
  }
}

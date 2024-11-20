export class UserInfoModel {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  darkTheme: boolean;
  isDeviceUser: boolean;
  language: string;
  timeZone: string;
  formats: string;
  archiveSoftwareVersion?: string;
  archiveModel?: string;
  archiveManufacturer?: string;
  archiveOsVersion?: string;
  timeRegistrationSoftwareVersion?: string;
  timeRegistrationModel?: string;
  timeRegistrationManufacturer?: string;
  timeRegistrationOsVersion?: string;

  constructor(data?: any) {
    if (data) {
      this.id = data.id;
      this.createdAt = data.createdAt;
      this.updatedAt = data.updatedAt;
      this.email = data.email;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.role = data.role;
      this.darkTheme = data.darkTheme;
      this.isDeviceUser = data.isDeviceUser;
      this.language = data.language;
      this.timeZone = data.timeZone;
      this.formats = data.formats;
      this.archiveSoftwareVersion = data.archiveSoftwareVersion;
      this.archiveModel = data.archiveModel;
      this.archiveManufacturer = data.archiveManufacturer;
      this.archiveOsVersion = data.archiveOsVersion;
      this.timeRegistrationSoftwareVersion = data.timeRegistrationSoftwareVersion;
      this.timeRegistrationModel = data.timeRegistrationModel;
      this.timeRegistrationManufacturer = data.timeRegistrationManufacturer;
      this.timeRegistrationOsVersion = data.timeRegistrationOsVersion;
    }
  }
}

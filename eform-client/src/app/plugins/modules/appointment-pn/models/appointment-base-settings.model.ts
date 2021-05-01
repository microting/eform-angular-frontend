export class AppointmentBaseSettingsModel {
  logLevel: string;
  logLimit: string;
  sdkConnectionString: string;
  maxParallelismPlugin: number;
  numberOfWorkersPlugin: number;
  maxParallelismService: number;
  numberOfWorkersService: number;
  token: string;
  checkPreSendHours: number;
  checkRetraceHours: number;
  checkEveryMinute: number;
  includeBlankLocations: boolean;
  userEmailAddress: string;
  calendarName: string;
  directoryId: string;
  applicationId: string;
  colorsRule: boolean;
  outlookAddinId: string;
}

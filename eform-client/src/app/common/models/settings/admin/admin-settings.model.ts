import {
  HeaderSettingsModel,
  LoginPageSettingsModel,
  SdkSettingsModel,
  SmtpSettingsModel,
  SendGridSettingsModel,
  S3SettingsModel,
  SwiftSettingsModel,
} from 'src/app/common/models';

export class AdminSettingsModel {
  loginPageSettingsModel: LoginPageSettingsModel;
  smtpSettingsModel: SmtpSettingsModel;
  headerSettingsModel: HeaderSettingsModel;
  swiftSettingsModel: SwiftSettingsModel;
  s3SettingsModel: S3SettingsModel;
  sendGridSettingsModel: SendGridSettingsModel;
  sdkSettingsModel: SdkSettingsModel;
  siteLink: string;
  assemblyVersion: string;

  constructor() {
    this.loginPageSettingsModel = new LoginPageSettingsModel();
    this.smtpSettingsModel = new SmtpSettingsModel();
    this.headerSettingsModel = new HeaderSettingsModel();
    this.swiftSettingsModel = new SwiftSettingsModel();
    this.s3SettingsModel = new S3SettingsModel();
    this.sdkSettingsModel = new SdkSettingsModel();
    this.sendGridSettingsModel = new SendGridSettingsModel();
  }
}

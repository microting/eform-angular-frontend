import {LoginPageSettingsModel} from '../app-parts/login-page-settings.model';
import {SmtpSettingsModel} from '../smtp-settings.model';
import {HeaderSettingsModel} from '../app-parts/header-settings.model';
import {SwiftSettingsModel} from '../swift-settings.model';
import {SdkSettingsModel} from '../sdk-settings-model';
import {S3SettingsModel} from '../s3-settings.model';

export class AdminSettingsModel {
  loginPageSettingsModel: LoginPageSettingsModel;
  smtpSettingsModel: SmtpSettingsModel;
  headerSettingsModel: HeaderSettingsModel;
  swiftSettingsModel: SwiftSettingsModel;
  s3SettingsModel: S3SettingsModel;
  sdkSettingsModel: SdkSettingsModel;
  siteLink: string;
  assemblyVersion: string;

  constructor() {
    this.loginPageSettingsModel = new LoginPageSettingsModel;
    this.smtpSettingsModel = new SmtpSettingsModel;
    this.headerSettingsModel = new HeaderSettingsModel;
    this.swiftSettingsModel = new SwiftSettingsModel;
    this.s3SettingsModel = new S3SettingsModel();
    this.sdkSettingsModel = new SdkSettingsModel();
  }
}

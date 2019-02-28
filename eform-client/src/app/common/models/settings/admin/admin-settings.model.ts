import {LoginPageSettingsModel} from '../app-parts/login-page-settings.model';
import {SmtpSettingsModel} from '../smtp-settings.model';
import {HeaderSettingsModel} from '../app-parts/header-settings.model';
import {SwiftSettingsModel} from '../swift-settings.model';

export class AdminSettingsModel {
  loginPageSettingsModel: LoginPageSettingsModel;
  smtpSettingsModel: SmtpSettingsModel;
  headerSettingsModel: HeaderSettingsModel;
  swiftSettingsModel: SwiftSettingsModel;
  siteLink: string;
  assemblyVersion: string;

  constructor() {
    this.loginPageSettingsModel = new LoginPageSettingsModel;
    this.smtpSettingsModel = new SmtpSettingsModel;
    this.headerSettingsModel = new HeaderSettingsModel;
    this.swiftSettingsModel = new SwiftSettingsModel;
  }
}

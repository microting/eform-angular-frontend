import {LoginPageSettingsModel} from './login-page-settings.model';
import {SmtpSettingsModel} from './smtp-settings.model';
import {HeaderSettingsModel} from './header-settings.model';

export class AdminSettingsModel {
  loginPageSettingsModel: LoginPageSettingsModel;
  smtpSettingsModel: SmtpSettingsModel;
  headerSettingsModel: HeaderSettingsModel;
  siteLink: string;
  assemblyVersion: string;

  constructor() {
    this.loginPageSettingsModel = new LoginPageSettingsModel;
    this.smtpSettingsModel = new SmtpSettingsModel;
    this.headerSettingsModel = new HeaderSettingsModel;
  }
}

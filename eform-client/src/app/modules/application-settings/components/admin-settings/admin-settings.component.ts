import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { FileItem, FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { EventBrokerService } from 'src/app/common/helpers';
import {AdminSettingsModel, HeaderSettingsModel, LanguagesModel, LoginPageSettingsModel} from 'src/app/common/models';
import { AppSettingsService } from 'src/app/common/services';
import { AuthStateService } from 'src/app/common/store';
import { AppSettingsStateService} from 'src/app/modules/application-settings/components/store';
import * as R from 'ramda';
import {selectAuthIsAuth, selectBearerToken, selectCurrentUserIsAdmin} from 'src/app/state/auth/auth.selector';
import {Store} from '@ngrx/store';
import {zip} from 'rxjs';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss'],
})
export class AdminSettingsComponent implements OnInit, AfterViewInit {
  loginPageImageUploader: FileUploader = new FileUploader({
    url: '/api/images/login-page-images',
  });
  headerImageUploader: FileUploader = new FileUploader({
    url: '/api/images/eform-images',
  });
  headerImageLink: string;
  loginPageImageLink: string;
  spinnerStatus: boolean;
  latestVersion: string;
  adminSettingsModel: AdminSettingsModel = new AdminSettingsModel();
  othersSettings: { isEnableWidget: boolean } = {isEnableWidget: false};
  languagesModel: LanguagesModel = new LanguagesModel();
  previousAdminSettings: AdminSettingsModel;
  private selectBearerToken$ = this.authStore.select(selectBearerToken);
  private selectCurrentUserIsAdmin$ = this.authStore.select(selectCurrentUserIsAdmin);
  public selectAuthIsAuth$ = this.authStore.select(selectAuthIsAuth);
  //private selectAllAppSettings$ = this.authStore.select(selectAllAppSettings);

  constructor(
    private settingsService: AppSettingsService,
    private authStore: Store,
    private authStateService: AuthStateService,
    private eventBrokerService: EventBrokerService,
    private appSettingsStateService: AppSettingsStateService,
    private service: AppSettingsService,
  ) {}

  ngAfterViewInit() {}

  ngOnInit() {
    this.selectCurrentUserIsAdmin$.subscribe((isAdmin) => {
      this.getSettings();
    });
    let token = '';
    this.selectBearerToken$.subscribe((bearerToken) => (token = bearerToken));

    const uploadOptionsLogin: FileUploaderOptions = {
      headers: [
        {
          name: 'Authorization',
          value: token
        }
      ],
      url: '/api/images/login-page-images',
    };
    const uploadOptionsHeader: FileUploaderOptions = {
      headers: [
        {
          name: 'Authorization',
          value: token
        }
      ],
      url: '/api/images/eform-images',
    };
    this.loginPageImageUploader.setOptions(uploadOptionsLogin);
    this.headerImageUploader.setOptions(uploadOptionsHeader);
  }

  getLatestVersion() {
    this.settingsService.getLatestVersion().subscribe((operation) => {
      if (operation && operation.success) {
        this.latestVersion = operation.model;
      }
    });
  }

  initializeUploaders() {
    this.loginPageImageUploader.onAfterAddingFile = (_) => {
      if (this.loginPageImageUploader.queue.length > 1) {
        // save only last file
        this.loginPageImageUploader.removeFromQueue(this.loginPageImageUploader.queue[0]);
      }
    };
    this.headerImageUploader.onAfterAddingFile = (_) => {
      if (this.headerImageUploader.queue.length > 1) {
        // save only last file
        this.headerImageUploader.removeFromQueue(this.headerImageUploader.queue[0]);
      }
    };
    this.loginPageImageUploader.onAfterAddingAll = (files: FileItem[]) => {
      files.forEach((fileItem) => {
        fileItem.file.name = `${UUID.UUID()}.${R.last(fileItem.file.name.split('.'))}`; // uuid + file extension
        this.adminSettingsModel.loginPageSettingsModel.imageLink = fileItem.file.name;
      });
    };
    this.headerImageUploader.onAfterAddingAll = (files: FileItem[]) => {
      files.forEach((fileItem) => {
        fileItem.file.name = `${UUID.UUID()}.${R.last(fileItem.file.name.split('.'))}`; // uuid + file extension
        this.adminSettingsModel.headerSettingsModel.imageLink = fileItem.file.name;
      });
    };
  }

  getSettings() {
    zip(
      this.service.getAdminSettings(),
      this.service.getUserbackWidgetIsEnabled(),
      this.service.getLanguages()).subscribe((
        [adminSettings,
          othersSettings,
          languages]) => {
this.adminSettingsModel = adminSettings.model;
this.previousAdminSettings = adminSettings.model;
this.othersSettings.isEnableWidget = othersSettings.model.isUserbackWidgetEnabled;
this.languagesModel = languages.model;
      });
    //this.appSettingsStateService.getAdminSettings();
    // this.appSettingsStateService.getAllAppSettings();
    // this.selectAllAppSettings$.subscribe((allSettings) => {
    //   this.adminSettingsModel.loginPageSettingsModel = new LoginPageSettingsModel();
    //   this.adminSettingsModel.loginPageSettingsModel.mainText = allSettings.adminSettingsModel.loginPageSettingsModel.mainText;
    //   this.adminSettingsModel.loginPageSettingsModel.mainTextVisible =
    //     allSettings.adminSettingsModel.loginPageSettingsModel.mainTextVisible;
    //   this.adminSettingsModel.loginPageSettingsModel.secondaryText = allSettings.adminSettingsModel.loginPageSettingsModel.secondaryText;
    //   this.adminSettingsModel.loginPageSettingsModel.secondaryTextVisible =
    //     allSettings.adminSettingsModel.loginPageSettingsModel.secondaryTextVisible;
    //   this.adminSettingsModel.loginPageSettingsModel.imageLink = allSettings.adminSettingsModel.loginPageSettingsModel.imageLink;
    //   this.adminSettingsModel.loginPageSettingsModel.imageLinkVisible =
    //     allSettings.adminSettingsModel.loginPageSettingsModel.imageLinkVisible;
    //   this.adminSettingsModel.headerSettingsModel = new HeaderSettingsModel();
    //   this.adminSettingsModel.headerSettingsModel.mainText = allSettings.adminSettingsModel.headerSettingsModel.mainText;
    //   this.adminSettingsModel.headerSettingsModel.mainTextVisible = allSettings.adminSettingsModel.headerSettingsModel.mainTextVisible;
    //   this.adminSettingsModel.headerSettingsModel.secondaryText = allSettings.adminSettingsModel.headerSettingsModel.secondaryText;
    //   this.adminSettingsModel.headerSettingsModel.secondaryTextVisible =
    //     allSettings.adminSettingsModel.headerSettingsModel.secondaryTextVisible;
    //   this.adminSettingsModel.headerSettingsModel.imageLink = allSettings.adminSettingsModel.headerSettingsModel.imageLink;
    //   this.adminSettingsModel.headerSettingsModel.imageLinkVisible = allSettings.adminSettingsModel.headerSettingsModel.imageLinkVisible;
    //   this.othersSettings.isEnableWidget = allSettings.othersSettings.isUserbackWidgetEnabled;
    //   this.languagesModel.languages = [];
    //   allSettings.languagesModel.languages.forEach((language) => {
    //     this.languagesModel.languages.push(
    //       {languageCode: language.languageCode, isActive: language.isActive, id: language.id, name: language.name});
    //   });
    //   this.previousAdminSettings = this.adminSettingsModel;
    //   const adminSettings = allSettings.adminSettingsModel;
    //   const othersSettings = allSettings.othersSettings;
    this.initializeUploaders();
    this.getLatestVersion();
    //   if (adminSettings) {
    //     this.adminSettingsModel = adminSettings;
    //     this.previousAdminSettings = adminSettings;
    //
        if (this.adminSettingsModel.headerSettingsModel.imageLink) {
          this.headerImageLink =
            'api/images/eform-images?fileName=' +
            this.adminSettingsModel.headerSettingsModel.imageLink;
        } else {
          this.headerImageLink = '../../../assets/images/logo.png';
        }
    //
        if (this.adminSettingsModel.loginPageSettingsModel.imageLink) {
          this.loginPageImageLink =
            'api/images/login-page-images?fileName=' +
            this.adminSettingsModel.loginPageSettingsModel.imageLink;
        } else {
          this.loginPageImageLink = '../../../assets/images/eform-phone.jpg';
        }
    //   }
    //   if (othersSettings) {
    //     this.othersSettings = {...this.othersSettings, isEnableWidget: othersSettings.isUserbackWidgetEnabled};
    //   }
    //   this.languagesModel = allSettings.languagesModel;
    //}).unsubscribe();
  }

  updateAdminSettings() {
    if (this.headerImageUploader.queue.length > 0) {
      this.headerImageUploader.queue[0].upload();
    }
    if (this.loginPageImageUploader.queue.length > 0) {
      this.loginPageImageUploader.queue[0].upload();
    }

    //if (!R.equals(this.adminSettingsModel, this.previousAdminSettings)) { // TODO: fix this, it doesn't work
      this.appSettingsStateService
        .updateAdminSettings(this.adminSettingsModel)
        .subscribe((operation) => {
          if (operation && operation.success) {
            this.headerImageUploader.clearQueue();
            this.loginPageImageUploader.clearQueue();
            this.eventBrokerService.emit<void>('get-header-settings', null);
          }
        });
    //}

    this.updateOtherSettings();
    this.updateLanguages();
  }

  updateOtherSettings() {
    this.appSettingsStateService.updateUserbackWidgetIsEnabled(this.othersSettings.isEnableWidget)
      .subscribe((operation) => {
        if (operation && operation.success) {
        //
        }
      });
  }

  resetLoginPageSettings() {
    this.settingsService.resetLoginPageSettings().subscribe((operation) => {
      if (operation && operation.success) {
        //this.authStore.dispatch({type: '[AppSettings] Reset login page settings'});
        //this.appSettingsStateService.getAllAppSettings();
        this.getSettings();
      }
    });
  }

  resetHeaderSettings() {
    this.settingsService.resetHeaderSettings().subscribe((operation) => {
      if (operation && operation.success) {
        //this.authStore.dispatch({type: '[AppSettings] Reset header settings'});
        this.appSettingsStateService.getAllAppSettings();
        this.getSettings();
      }
    });
  }

  updateLanguages() {
    this.appSettingsStateService.updateLanguages(this.languagesModel).subscribe((operation) => {
      if (operation && operation.success) {
        this.appSettingsStateService.getAllAppSettings();
      }
    });
  }
}

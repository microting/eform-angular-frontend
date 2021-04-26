import {
  Component,
  HostBinding,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UUID } from 'angular2-uuid';
import { FileItem, FileUploader, FileUploaderOptions } from 'ng2-file-upload';
import { EventBrokerService } from 'src/app/common/helpers';
import { AdminSettingsModel } from 'src/app/common/models/settings';
import { AppSettingsService } from 'src/app/common/services/settings';
import { AuthService } from 'src/app/common/services/auth';
import { AuthStateService } from 'src/app/common/store';

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

  constructor(
    private settingsService: AppSettingsService,
    private authStateService: AuthStateService,
    private eventBrokerService: EventBrokerService
  ) {}

  get currentRole(): string {
    return this.authStateService.currentRole;
  }

  ngAfterViewInit() {}

  ngOnInit() {
    if (this.currentRole === 'admin') {
      // this.getLatestVersion();
      this.getAdminSettings();
      this.initializeUploaders();
    }

    const authHeader: Array<{
      name: string;
      value: string;
    }> = [];
    authHeader.push({
      name: 'Authorization',
      value: this.authStateService.bearerToken,
    });
    const uploadOptions = <FileUploaderOptions>{ headers: authHeader };
    this.loginPageImageUploader.setOptions(uploadOptions);
    this.headerImageUploader.setOptions(uploadOptions);
  }

  getLatestVersion() {
    this.settingsService.getLatestVersion().subscribe((operation) => {
      if (operation && operation.success) {
        this.latestVersion = operation.model;
      }
    });
  }

  initializeUploaders() {
    // TODO: REWORK
    const re = /(?:\.([^.]+))?$/;
    this.loginPageImageUploader.onAfterAddingFile = (f) => {
      if (this.loginPageImageUploader.queue.length > 1) {
        this.loginPageImageUploader.removeFromQueue(
          this.loginPageImageUploader.queue[0]
        );
      }
    };
    this.headerImageUploader.onAfterAddingFile = (f) => {
      if (this.headerImageUploader.queue.length > 1) {
        this.headerImageUploader.removeFromQueue(
          this.headerImageUploader.queue[0]
        );
      }
    };
    this.loginPageImageUploader.onAfterAddingAll = (files: FileItem[]) => {
      files.forEach((fileItem) => {
        fileItem.file.name = UUID.UUID() + '.' + re.exec(fileItem.file.name)[1];
        this.adminSettingsModel.loginPageSettingsModel.imageLink =
          fileItem.file.name;
      });
    };
    this.headerImageUploader.onAfterAddingAll = (files: FileItem[]) => {
      files.forEach((fileItem) => {
        fileItem.file.name = UUID.UUID() + '.' + re.exec(fileItem.file.name)[1];
        this.adminSettingsModel.headerSettingsModel.imageLink =
          fileItem.file.name;
      });
    };
  }

  getAdminSettings() {
    this.settingsService.getAdminSettings().subscribe((operation) => {
      if (operation && operation.success) {
        this.adminSettingsModel = operation.model;

        if (this.adminSettingsModel.headerSettingsModel.imageLink) {
          this.headerImageLink =
            'api/images/eform-images?fileName=' +
            this.adminSettingsModel.headerSettingsModel.imageLink;
        } else {
          this.headerImageLink = '../../../assets/images/logo.png';
        }

        if (this.adminSettingsModel.loginPageSettingsModel.imageLink) {
          this.loginPageImageLink =
            'api/images/login-page-images?fileName=' +
            this.adminSettingsModel.loginPageSettingsModel.imageLink;
        } else {
          this.loginPageImageLink = '../../../assets/images/eform-phone.jpg';
        }
      } else {
      }
    });
  }

  updateAdminSettings() {
    if (this.headerImageUploader.queue.length > 0) {
      this.headerImageUploader.queue[0].upload();
    }
    if (this.loginPageImageUploader.queue.length > 0) {
      this.loginPageImageUploader.queue[0].upload();
    }

    this.settingsService
      .updateAdminSettings(this.adminSettingsModel)
      .subscribe((operation) => {
        if (operation && operation.success) {
          this.getAdminSettings();
          this.headerImageUploader.clearQueue();
          this.loginPageImageUploader.clearQueue();
          this.eventBrokerService.emit<void>('get-header-settings', null);
        } else {
        }
      });
  }

  resetLoginPageSettings() {
    this.settingsService.resetLoginPageSettings().subscribe((operation) => {
      if (operation && operation.success) {
        this.getAdminSettings();
      } else {
      }
    });
  }

  resetHeaderSettings() {
    this.settingsService.resetHeaderSettings().subscribe((operation) => {
      if (operation && operation.success) {
        this.getAdminSettings();
      } else {
      }
    });
  }
}

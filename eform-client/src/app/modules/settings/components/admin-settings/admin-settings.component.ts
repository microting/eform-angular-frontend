import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AdminSettingsModel} from 'app/models';
import {NotifyService, AuthService, SettingsService} from 'app/services';
import {FileItem, FileUploader} from 'ng2-file-upload';
import {UUID} from 'angular2-uuid';
import {GoogleAuthInfoModel} from '../../../../models';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {
  loginPageImageUploader: FileUploader = new FileUploader({url: '/api/images/login-page-images'});
  headerImageUploader: FileUploader = new FileUploader({url: '/api/images/eform-images'});
  headerImageLink: string;
  loginPageImageLink: string;
  spinnerStatus: boolean;
  adminSettingsModel: AdminSettingsModel = new AdminSettingsModel;
  googleAuthInfoModel: GoogleAuthInfoModel = new GoogleAuthInfoModel;

  constructor(private settingsService: SettingsService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private notifyService: NotifyService) {
  }

  get currentRole(): string {
    return this.authService.currentRole;
  };

  ngOnInit() {
    if (this.currentRole === 'admin') {
      this.getAdminSettings();
      this.initializeUploaders();
    }
    this.getGoogleAuthenticatorInfo();
  }

  initializeUploaders() {
    const re = /(?:\.([^.]+))?$/;
    this.loginPageImageUploader.onAfterAddingFile = f => {
      if (this.loginPageImageUploader.queue.length > 1) {
        this.loginPageImageUploader.removeFromQueue(this.loginPageImageUploader.queue[0]);
      }
    };
    this.headerImageUploader.onAfterAddingFile = f => {
      if (this.headerImageUploader.queue.length > 1) {
        this.headerImageUploader.removeFromQueue(this.headerImageUploader.queue[0]);
      }
    };
    this.loginPageImageUploader.onAfterAddingAll = (files: FileItem[]) => {
      files.forEach(fileItem => {
        fileItem.file.name = UUID.UUID() + '.' + re.exec(fileItem.file.name)[1];
        this.adminSettingsModel.loginPageSettingsModel.imageLink = fileItem.file.name;
      });
    };
    this.headerImageUploader.onAfterAddingAll = (files: FileItem[]) => {
      files.forEach(fileItem => {
        fileItem.file.name = UUID.UUID() + '.' + re.exec(fileItem.file.name)[1];
        this.adminSettingsModel.headerSettingsModel.imageLink = fileItem.file.name;
      });
    };
  }

  getAdminSettings() {
    this.spinnerStatus = true;
    this.settingsService.getAdminSettings().subscribe(operation => {
      if (operation && operation.success) {
        this.adminSettingsModel = operation.model;

        if (this.adminSettingsModel.headerSettingsModel.imageLink) {
          this.headerImageLink = 'api/images/eform-images?fileName=' + this.adminSettingsModel.headerSettingsModel.imageLink;
        } else {
          this.headerImageLink = '../../../assets/images/logo.png';
        }

        if (this.adminSettingsModel.loginPageSettingsModel.imageLink) {
          this.loginPageImageLink = 'api/images/login-page-images?fileName=' + this.adminSettingsModel.loginPageSettingsModel.imageLink;
        } else {
          this.loginPageImageLink = '../../../assets/images/eform-phone.jpg';
        }

        this.spinnerStatus = false;
      } else {
        this.notifyService.error({text: operation.message});
        this.spinnerStatus = false;
      }
    });
  }

  getGoogleAuthenticatorInfo() {
    this.authService.getGoogleAuthenticatorInfo().subscribe((data) => {
      if (data && data.model) {
        this.googleAuthInfoModel = data.model;
      }
    });
  }

  isTwoFactorEnabledCheckBoxChanged(e) {
    if (e.target && e.target.checked) {
      this.googleAuthInfoModel.isTwoFactorEnabled = true;
    } else if (e.target && !e.target.checked) {
      this.googleAuthInfoModel.isTwoFactorEnabled = false;
    } else {
      return;
    }
    this.authService.updateGoogleAuthenticatorInfo(this.googleAuthInfoModel).subscribe((data) => {
      if (data.success) {
        this.authService.logout().subscribe(() => {
          localStorage.clear();
          this.router.navigate(['/login']).then();
        });
      } else {
        this.notifyService.error({text: data.message});
      }
    });
  }

  deleteGoogleAuthenticatorInfo() {
    this.authService.deleteGoogleAuthenticatorInfo().subscribe((data) => {
      if (data && data.success) {
        this.googleAuthInfoModel.psk = null;
      }
    });
  }

  updateAdminSettings() {
    this.spinnerStatus = true;

    if (this.headerImageUploader.queue.length > 0) {
      this.headerImageUploader.queue[0].upload();
    }
    if (this.loginPageImageUploader.queue.length > 0) {
      this.loginPageImageUploader.queue[0].upload();
    }

    this.settingsService.updateAdminSettings(this.adminSettingsModel).subscribe(operation => {
      if (operation && operation.success) {
        this.notifyService.success({text: operation.message});
        this.getAdminSettings();
      } else {
        this.notifyService.error({text: operation.message});
        this.getAdminSettings();
      }
    });
  }

  resetLoginPageSettings() {
    this.spinnerStatus = true;
    this.settingsService.resetLoginPageSettings().subscribe(operation => {
      if (operation && operation.success) {
        this.notifyService.success({text: operation.message});
        this.getAdminSettings();
      } else {
        this.notifyService.error({text: operation.message});
        this.spinnerStatus = false;
      }
    });
  }

  resetHeaderSettings() {
    this.spinnerStatus = true;
    this.settingsService.resetHeaderSettings().subscribe(operation => {
      if (operation && operation.success) {
        this.notifyService.success({text: operation.message});
        this.getAdminSettings();
      } else {
        this.notifyService.error({text: operation.message});
      }
    });
  }
}

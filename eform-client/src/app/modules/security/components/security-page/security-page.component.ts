import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApplicationPages } from 'src/app/common/const';
import {
  SecurityGroupsRequestModel,
  SecurityGroupsModel,
  PageSettingsModel, SecurityGroupModel, SecurityGroupSettingsUpdateModel,
} from 'src/app/common/models';
import {
  SecurityGroupsService,
  UserSettingsService,
} from 'src/app/common/services';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';

@AutoUnsubscribe()
@Component({
  selector: 'app-security-page',
  templateUrl: './security-page.component.html',
  styleUrls: ['./security-page.component.scss'],
})
export class SecurityPageComponent implements OnInit, OnDestroy {
  @ViewChild('modalGroupDelete', { static: true }) modalGroupDelete;
  @ViewChild('modalGroupSettings', { static: true }) modalGroupSettings;
  securityGroups: SecurityGroupsModel = new SecurityGroupsModel();
  securityGroupsRequestModel: SecurityGroupsRequestModel = new SecurityGroupsRequestModel();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  getSecurityGroups$: Subscription;
  updateSecurityGroupSettings$: Subscription;

  constructor(
    private securityGroupsService: SecurityGroupsService,
    public userSettingsService: UserSettingsService
  ) {}

  ngOnInit() {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.userSettingsService.getLocalPageSettings(
      'pagesSettings',
      ApplicationPages[ApplicationPages.Security]
    ).settings;
    this.getSecurityGroups();
  }

  updateLocalPageSettings(localStorageItemName: string) {
    this.userSettingsService.updateLocalPageSettings(
      localStorageItemName,
      this.localPageSettings,
      ApplicationPages[ApplicationPages.Security]
    );
    this.getLocalPageSettings();
  }

  getSecurityGroups() {
    this.securityGroupsRequestModel.pageSize = this.localPageSettings.pageSize;
    this.getSecurityGroups$ = this.securityGroupsService
      .getAllSecurityGroups(this.securityGroupsRequestModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.securityGroups = data.model;
        }
      });
  }

  openDeleteModal(securityGroup: SecurityGroupModel) {
    this.modalGroupDelete.show(securityGroup);
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.securityGroupsRequestModel.offset = e;
      if (e === 0) {
        this.securityGroupsRequestModel.pageIndex = 0;
      } else {
        this.securityGroupsRequestModel.pageIndex = Math.floor(
          e / this.securityGroupsRequestModel.pageSize
        );
      }
      this.getSecurityGroups();
    }
  }

  openSettingsModal(securityGroup: SecurityGroupModel) {
    this.modalGroupSettings.show(securityGroup);
  }

  updateSecurityGroupSettings(settingsUpdateModel: SecurityGroupSettingsUpdateModel) {
    this.updateSecurityGroupSettings$ = this.securityGroupsService
      .updateSecurityGroupSettings(settingsUpdateModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.getSecurityGroups();
        }
      });
  }

  onLabelInputChanged(label: string) {
    this.securityGroupsRequestModel.nameFilter = label;
    this.getSecurityGroups();
  }

  ngOnDestroy(): void {}
}

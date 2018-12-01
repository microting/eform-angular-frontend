import {Component, OnInit, ViewChild} from '@angular/core';
import {ApplicationPages} from 'src/app/common/enums';
import {SecurityGroupsRequestModel, SecurityGroupsModel, PageSettingsModel} from 'src/app/common/models';
import {SecurityGroupsService, UserSettingsService} from 'src/app/common/services';

@Component({
  selector: 'app-security-page',
  templateUrl: './security-page.component.html',
  styleUrls: ['./security-page.component.scss']
})
export class SecurityPageComponent implements OnInit {
  @ViewChild('modalGroupDelete') modalGroupDelete;
  securityGroups: SecurityGroupsModel = new SecurityGroupsModel();
  securityGroupsRequestModel: SecurityGroupsRequestModel = new SecurityGroupsRequestModel();
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  spinnerStatus = false;

  get applicationPagesEnum() {
    return ApplicationPages;
  }

  constructor(private securityGroupsService: SecurityGroupsService, public userSettingsService: UserSettingsService) {
  }

  ngOnInit() {
    this.getLocalPageSettings();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.userSettingsService.getLocalPageSettings
    ('pagesSettings', ApplicationPages[ApplicationPages.Security])
      .settings;
    this.getSecurityGroups();
  }

  updateLocalPageSettings(localStorageItemName: string) {
    this.userSettingsService.updateLocalPageSettings
    (localStorageItemName, this.localPageSettings, ApplicationPages[ApplicationPages.Security]);
    this.getLocalPageSettings();
  }

  getSecurityGroups() {
    this.spinnerStatus = true;
    this.securityGroupsRequestModel.pageSize = this.localPageSettings.pageSize;
    this.securityGroupsService.getAllSecurityGroups(this.securityGroupsRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.securityGroups = data.model;
      }
      this.spinnerStatus = false;
    });
  }

  openDeleteModal(securityGroup: any) {
    this.modalGroupDelete.show(securityGroup);
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.securityGroupsRequestModel.offset = e;
      if (e === 0) {
        this.securityGroupsRequestModel.pageIndex = 0;
      } else {
        this.securityGroupsRequestModel.pageIndex
          = Math.floor(e / this.securityGroupsRequestModel.pageSize);
      }
      this.getSecurityGroups();
    }
  }

  onLabelInputChanged(label: string) {
    this.securityGroupsRequestModel.nameFilter = label;
    this.getSecurityGroups();
  }

}

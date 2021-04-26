import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  SecurityGroupModel,
  SecurityGroupSettingsUpdateModel,
  TableHeaderElementModel,
  Paged,
} from 'src/app/common/models';
import { SecurityGroupsService } from 'src/app/common/services';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Subscription } from 'rxjs';
import { SecurityStateService } from 'src/app/modules/security/components/store/security-state.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-security-page',
  templateUrl: './security-page.component.html',
  styleUrls: ['./security-page.component.scss'],
})
export class SecurityPageComponent implements OnInit, OnDestroy {
  @ViewChild('modalGroupDelete', { static: true }) modalGroupDelete;
  @ViewChild('modalGroupSettings', { static: true }) modalGroupSettings;
  securityGroups: Paged<SecurityGroupModel> = new Paged<SecurityGroupModel>();
  getSecurityGroups$: Subscription;
  updateSecurityGroupSettings$: Subscription;

  tableHeaders: TableHeaderElementModel[] = [
    { name: 'Id', elementId: '', sortable: true },
    { name: 'GroupName', elementId: '', sortable: true },
    { name: 'UserAmount', elementId: '', sortable: true },
    { name: 'Actions', elementId: '', sortable: false },
  ];

  constructor(
    private securityGroupsService: SecurityGroupsService,
    public securityStateService: SecurityStateService
  ) {}

  ngOnInit() {
    this.getSecurityGroups();
  }

  getSecurityGroups() {
    this.getSecurityGroups$ = this.securityStateService
      .getAllSecurityGroups()
      .subscribe((data) => {
        if (data && data.success) {
          this.securityGroups = data.model;
        }
      });
  }

  openDeleteModal(securityGroup: SecurityGroupModel) {
    this.modalGroupDelete.show(securityGroup);
  }

  changePage(offset: number) {
    this.securityStateService.changePage(offset);
    this.getSecurityGroups();
  }

  openSettingsModal(securityGroup: SecurityGroupModel) {
    this.modalGroupSettings.show(securityGroup);
  }

  updateSecurityGroupSettings(
    settingsUpdateModel: SecurityGroupSettingsUpdateModel
  ) {
    this.updateSecurityGroupSettings$ = this.securityGroupsService
      .updateSecurityGroupSettings(settingsUpdateModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.getSecurityGroups();
          this.modalGroupSettings.hide();
        }
      });
  }

  onLabelInputChanged(label: string) {
    this.securityStateService.updateNameFilter(label);
    this.getSecurityGroups();
    this.securityStateService.checkOffset();
  }

  ngOnDestroy(): void {}

  onPageSizeChanged(pageSize: number) {
    this.securityStateService.updatePageSize(pageSize);
    this.getSecurityGroups();
  }

  onSortTable(sort: string) {
    this.securityStateService.onSortTable(sort);
    this.getSecurityGroups();
  }

  onDeleteSecurityGroup(id: number) {
    this.securityGroupsService.deleteSecurityGroup(id).subscribe((data) => {
      if (data && data.success) {
        this.securityStateService.onDelete();
        this.getSecurityGroups();
      }
    });
  }
}

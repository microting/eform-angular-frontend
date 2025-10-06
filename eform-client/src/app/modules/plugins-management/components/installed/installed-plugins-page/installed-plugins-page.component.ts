import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {InstalledPluginStatusEnum} from 'src/app/common/const';
import {
  SecurityGroupsService,
  PluginPermissionsService,
  PluginsManagementService,
} from 'src/app/common/services';
import {
  SecurityGroupModel,
  SecurityGroupsRequestModel,
  InstalledPluginModel,
  InstalledPluginsModel,
  InstalledPluginsRequestModel,
  PluginGroupPermissionsListModel,
} from 'src/app/common/models';
import {MtxGridColumn} from '@ng-matero/extensions/grid';
import {dialogConfigHelper} from 'src/app/common/helpers';
import {MatDialog} from '@angular/material/dialog';
import {Overlay} from '@angular/cdk/overlay';
import {AuthStateService} from 'src/app/common/store';
import {
  InstalledPluginModalComponent,
  InstalledPluginPermissionsComponent
} from '../../';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import { TranslateService } from '@ngx-translate/core';

@AutoUnsubscribe()
@Component({
    selector: 'app-installed-plugins-page',
    templateUrl: './installed-plugins-page.component.html',
    styleUrls: ['./installed-plugins-page.component.scss'],
    standalone: false
})
export class InstalledPluginsPageComponent implements OnInit, OnDestroy{
  private pluginManagementService = inject(PluginsManagementService);
  private pluginPermissionsService = inject(PluginPermissionsService);
  private securityGroupsService = inject(SecurityGroupsService);
  private dialog = inject(MatDialog);
  private overlay = inject(Overlay);
  private authStateService = inject(AuthStateService);
  private translateService = inject(TranslateService);

  installedPluginsRequestModel: InstalledPluginsRequestModel = new InstalledPluginsRequestModel();
  installedPluginsModel: InstalledPluginsModel = new InstalledPluginsModel();
  securityGroups: SecurityGroupModel[] = [];

  tableHeaders: MtxGridColumn[] = [
    {header: this.translateService.stream('Id'), field: 'id'},
    {header: this.translateService.stream('Name'), field: 'name',},
    {header: this.translateService.stream('Version'), field: 'version',},
    {header: this.translateService.stream('Newest version available'), field: 'versionAvailable'},
    {
      pinned: 'right',
      header: this.translateService.stream('Actions'), field: 'actions'},
  ];
  installedPluginModalComponentAfterClosedSub$: Subscription;
  installedPluginPermissionsComponentAfterClosedSub$: Subscription;
  getAllSecurityGroupsSub$: Subscription;
  getInstalledPluginsSub$: Subscription;
  getPluginPermissionsSub$: Subscription;
  getPluginGroupPermissionsSub$: Subscription;

  get statusEnum() {
    return InstalledPluginStatusEnum;
  }

  ngOnInit() {
    this.getAllSecurityGroupsSub$ = this.securityGroupsService
      .getAllSecurityGroups(new SecurityGroupsRequestModel())
      .subscribe((data) => {
        if (data && data.success) {
          this.securityGroups = data.model.entities;
        }
      });

    this.getInstalledPlugins();
  }

  getInstalledPlugins() {
    this.getInstalledPluginsSub$ = this.pluginManagementService
      .getInstalledPlugins(this.installedPluginsRequestModel)
      .subscribe((data) => {
        if (data && data.success) {
          this.installedPluginsModel = data.model;
        }
      });
  }

  openPluginModal(installedPlugin: InstalledPluginModel, status: number) {
    this.installedPluginModalComponentAfterClosedSub$ = this.dialog.open(InstalledPluginModalComponent,
      dialogConfigHelper(this.overlay, {...installedPlugin, status: status}))
      .afterClosed().subscribe(data => data ? this.authStateService.logout() : undefined);
  }


  showPermissionsModal(installedPlugin: InstalledPluginModel) {
    this.getPluginPermissionsSub$ = this.pluginPermissionsService
      .getPluginPermissions(installedPlugin.id)
      .subscribe((data) => {
        if (data && data.success) {
          this.getPluginGroupPermissionsSub$ = this.pluginPermissionsService
            .getPluginGroupPermissions(installedPlugin.id)
            .subscribe((groupData) => {
              if (groupData && groupData.success) {
                for (const securityGroup of this.securityGroups) {
                  if (
                    !groupData.model.some((p) => p.groupId === securityGroup.id)
                  ) {
                    groupData.model.push(
                      new PluginGroupPermissionsListModel({
                        groupId: securityGroup.id,
                        permissions: data.model.map((p) => ({...p})),
                      })
                    );
                  }
                }
              }
              this.installedPluginPermissionsComponentAfterClosedSub$ = this.dialog.open(InstalledPluginPermissionsComponent,
                dialogConfigHelper(this.overlay, {
                  pluginPermissions: {pluginId: installedPlugin.id, groupPermissions: groupData.model,},
                  securityGroups: this.securityGroups}
                ))
                .afterClosed().subscribe((data) => data ? undefined : undefined);
            });
        }
      });
  }

  ngOnDestroy(): void {
  }
}

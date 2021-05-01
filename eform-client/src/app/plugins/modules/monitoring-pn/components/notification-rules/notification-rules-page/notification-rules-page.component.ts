import {Component, OnInit, ViewChild} from '@angular/core';
import {PageSettingsModel} from 'src/app/common/models/settings';

import {SharedPnService} from 'src/app/plugins/modules/shared/services';
import {MonitoringPnNotificationRulesService} from '../../../services';
import {
  NotificationRuleSimpleModel,
  NotificationRulesListModel,
  NotificationsRequestModel
} from '../../../models';
import {NotificationRulesDeleteComponent, NotificationRulesEditComponent} from '..';
import {PluginClaimsHelper} from '../../../../../../common/helpers';
import {MonitoringPnClaims} from '../../../const/monitoring-pn-claims.const';
import {DeviceUserService} from '../../../../../../common/services/device-users';
import {SiteDto} from '../../../../../../common/models/dto';

@Component({
  selector: 'app-monitoring-pn-notification-rules-page',
  templateUrl: './notification-rules-page.component.html',
  styleUrls: ['./notification-rules-page.component.scss']
})
export class NotificationRulesPageComponent implements OnInit {
  @ViewChild('editRuleModal', {static: false}) editRuleModal: NotificationRulesEditComponent;
  @ViewChild('deleteRuleModal', {static: false}) deleteRuleModal: NotificationRulesDeleteComponent;
  localPageSettings: PageSettingsModel = new PageSettingsModel();
  rulesModel: NotificationRulesListModel = new NotificationRulesListModel();
  rulesRequestModel: NotificationsRequestModel = new NotificationsRequestModel();
  sitesDto: SiteDto[];

  constructor(
    private sharedPnService: SharedPnService,
    private monitoringPnRulesService: MonitoringPnNotificationRulesService,
    private deviceUsersService: DeviceUserService
  ) { }

  get pluginClaimsHelper() {
    return PluginClaimsHelper;
  }

  get monitoringPnClaims() {
    return MonitoringPnClaims;
  }

  ngOnInit() {
    this.getLocalPageSettings();
    this.loadAllSimpleSites();
  }

  getLocalPageSettings() {
    this.localPageSettings = this.sharedPnService
      .getLocalPageSettings('monitoringPnLocalSettings', 'NotificationRules')
      .settings;
    this.getRulesList();
  }

  updateLocalPageSettings() {
    this.sharedPnService.updateLocalPageSettings(
      'monitoringPnLocalSettings',
      this.localPageSettings,
      'NotificationRules'
    );
    this.getRulesList();
  }

  getRulesList() {
    this.rulesRequestModel.isSortDsc = this.localPageSettings.isSortDsc;
    this.rulesRequestModel.sort = this.localPageSettings.sort;
    this.rulesRequestModel.pageSize = this.localPageSettings.pageSize;

    this.monitoringPnRulesService.getRulesList(this.rulesRequestModel).subscribe((data) => {
      if (data && data.success) {
        this.rulesModel = data.model;
      }
    });
  }

  // showEditRuleModal(id?: number) {
  //   this.editRuleModal.show(id);
  // }

  showDeleteRuleModal(model: NotificationRuleSimpleModel) {
    this.deleteRuleModal.show(model);
  }

  sortTable(sort: string) {
    if (this.localPageSettings.sort === sort) {
      this.localPageSettings.isSortDsc = !this.localPageSettings.isSortDsc;
    } else {
      this.localPageSettings.isSortDsc = false;
      this.localPageSettings.sort = sort;
    }
    this.updateLocalPageSettings();
  }

  changePage(e: any) {
    if (e || e === 0) {
      this.rulesRequestModel.offset = e;
      if (e === 0) {
        this.rulesRequestModel.pageIndex = 0;
      } else {
        this.rulesRequestModel.pageIndex
          = Math.floor(e / this.rulesRequestModel.pageSize);
      }
      this.getRulesList();
    }
  }

  loadAllSimpleSites() {
    this.deviceUsersService.getAllDeviceUsers().subscribe(operation => {
      if (operation && operation.success) {
        this.sitesDto = operation.model.map((i) => { i.fullName = i.siteName; return i; });

        // this.sitesDto = operation.model.map(x => ({...x, fullName: `${x.firstName} ${x.lastName}`}));
      }
    });
  }
}

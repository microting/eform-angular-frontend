import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MonitoringPnLayoutComponent} from './layouts';
import {AdminGuard, AuthGuard, ClaimsGuard, PermissionGuard} from '../../../common/guards';
import {MonitoringSettingsComponent, NotificationRulesEditComponent, NotificationRulesPageComponent} from './components';
import {MonitoringPnClaims} from './const/monitoring-pn-claims.const';
import {EntitySearchCreateComponent, EntitySearchEditComponent} from 'src/app/modules/advanced/components';
import {UserClaimsEnum} from 'src/app/common/const';

export const routes: Routes = [
  {
    path: '',
    component: MonitoringPnLayoutComponent,
    canActivate: [PermissionGuard],
    data: {requiredPermission: MonitoringPnClaims.accessMonitoringPlugin},
    children: [
      {
        path: 'settings',
        component: MonitoringSettingsComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'notification-rules',
        component: NotificationRulesPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'notification-rules/edit/:id',
        component: NotificationRulesEditComponent,
        canActivate: [ClaimsGuard],
        data: {requiredClaim: UserClaimsEnum.entitySearchRead}
      },
      {
        path: 'notification-rules/create',
        component: NotificationRulesEditComponent,
        canActivate: [ClaimsGuard],
        data: {requiredClaim: UserClaimsEnum.entitySearchRead}
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoringPnRoutingModule {
}

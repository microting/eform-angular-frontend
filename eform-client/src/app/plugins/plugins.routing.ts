import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'src/app/common/guards';

export const routes: Routes = [
  {
    path: 'installationchecking-pn',
    canActivate: [AuthGuard],
    loadChildren: './modules/installationchecking-pn/installationchecking-pn.module#InstallationCheckingPnModule'
},
{
  path: 'customers-pn',
  canActivate: [AuthGuard],
  loadChildren: './modules/customers-pn/customers-pn.module#CustomersPnModule'
},
  {
    path: 'monitoring-pn',
    canActivate: [AuthGuard],
    loadChildren: './modules/monitoring-pn/monitoring-pn.module#MonitoringPnModule'
  },
  {
    path: 'insight-dashboard-pn',
    canActivate: [AuthGuard],
    loadChildren: './modules/insight-dashboard-pn/insight-dashboard-pn.module#InsightDashboardPnModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PluginsRouting {
}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'src/app/common/guards';

export const routes: Routes = [
  {
    path: 'monitoring-pn',
    canActivate: [AuthGuard],
    loadChildren: './modules/monitoring-pn/monitoring-pn.module#MonitoringPnModule'
  }

// INSERT ROUTES HERE
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PluginsRouting {
}

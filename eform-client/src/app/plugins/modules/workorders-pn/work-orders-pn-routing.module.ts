import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuard, AuthGuard, PermissionGuard} from 'src/app/common/guards';
import {WorkOrdersPnLayoutComponent} from './layouts';
import {WorkOrdersPnClaims} from './const';
import {WorkOrdersPageComponent, WorkOrdersSettingsComponent} from './components';

export const routes: Routes = [
  {
    path: '',
    component: WorkOrdersPnLayoutComponent,
    canActivate: [PermissionGuard],
    data: {requiredPermission: WorkOrdersPnClaims.accessWorkOrdersPlugin},
    children: [
      {
        path: 'orders',
        canActivate: [AuthGuard],
        component: WorkOrdersPageComponent
      },
      {
        path: 'settings',
        canActivate: [AuthGuard],
        component: WorkOrdersSettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkOrdersPnRoutingModule {
}

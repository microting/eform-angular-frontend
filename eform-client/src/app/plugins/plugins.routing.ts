import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'src/app/common/guards';

export const routes: Routes = [
  {
    path: 'trash-inspection-pn',
    canActivate: [AuthGuard],
    loadChildren: './modules/trash-inspection-pn/trash-inspection-pn.module#TrashInspectionPnModule'
  },
  {
    path: 'customers-pn',
    canActivate: [AuthGuard],
    loadChildren: './modules/customers-pn/customers-pn.module#CustomersPnModule'
  },
  {
    path: 'machine-area-pn',
    canActivate: [AuthGuard],
    loadChildren: './modules/machine-area-pn/machine-area-pn.module#MachineAreaPnModule'
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PluginsRouting {
}

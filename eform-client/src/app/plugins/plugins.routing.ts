import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'src/app/common/guards';

export const routes: Routes = [
  {
    path: 'machine-area-pn',
    canActivate: [AuthGuard],
    loadChildren: './modules/machine-area-pn/machine-area-pn.module#MachineAreaPnModule'
  },
  {
    path: 'customers-pn',
    canActivate: [AuthGuard],
    loadChildren: './modules/customers-pn/customers-pn.module#CustomersPnModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PluginsRouting {
}

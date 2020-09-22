import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'src/app/common/guards';

export const routes: Routes = [
  // INSERT ROUTES HERE
  {
    path: 'work-orders-pn',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/workorders-pn/work-orders-pn.module').then(m => m.WorkOrdersPnModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PluginsRouting {
}

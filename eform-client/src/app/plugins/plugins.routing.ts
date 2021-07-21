import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'src/app/common/guards';

export const routes: Routes = [
  // INSERT ROUTES HERE
  {
    path: 'workflow-pn',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./modules/workflow-pn/workflow-pn.module').then(
        (m) => m.WorkflowPnModule
      ),
  },
  {
    path: 'items-planning-pn',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/items-planning-pn/items-planning-pn.module').then(m => m.ItemsPlanningPnModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PluginsRouting {
}

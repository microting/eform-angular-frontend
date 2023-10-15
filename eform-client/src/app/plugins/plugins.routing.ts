import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/common/guards';

export const routes: Routes = [
  // INSERT ROUTES HERE
  {
    path: 'workflow-pn',
    loadChildren: () => import('./modules/workflow-pn/workflow-pn.module')
      .then(m => m.WorkflowPnModule)
  },
  {
    path: 'outer-inner-resource-pn',
    loadChildren: () => import('./modules/outer-inner-resource-pn/outer-inner-resource-pn.module')
      .then(m => m.OuterInnerResourcePnModule)
  },
  {
    path: 'greate-belt-pn',
    loadChildren: () => import('./modules/greate-belt-pn/greate-belt-pn.module')
      .then(m => m.GreateBeltPnModule)
  },
  {
    path: 'backend-configuration-pn',
    loadChildren: () => import('./modules/backend-configuration-pn/backend-configuration-pn.module')
      .then(m => m.BackendConfigurationPnModule)
  },
  {
    path: 'time-planning-pn',
    loadChildren: () => import('./modules/time-planning-pn/time-planning-pn.module')
      .then(m => m.TimePlanningPnModule)
  },
  {
    path: 'items-planning-pn',
    loadChildren: () => import('./modules/items-planning-pn/items-planning-pn.module')
      .then(m => m.ItemsPlanningPnModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PluginsRouting {}

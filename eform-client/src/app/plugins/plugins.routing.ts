import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/common/guards';

export const routes: Routes = [
    {
    path: 'items-planning-pn',
    loadChildren: () => import('./modules/items-planning-pn/items-planning-pn.module')
      .then(m => m.ItemsPlanningPnModule)
  },
  {
    path: 'time-planning-pn',
    loadChildren: () => import('./modules/time-planning-pn/time-planning-pn.module')
      .then(m => m.TimePlanningPnModule)
  },
  {
    path: 'backend-configuration-pn',
    loadChildren: () => import('./modules/backend-configuration-pn/backend-configuration-pn.module')
      .then(m => m.BackendConfigurationPnModule)
  },
  {
    path: 'greate-belt-pn',
    loadChildren: () => import('./modules/greate-belt-pn/greate-belt-pn.module')
      .then(m => m.GreateBeltPnModule)
  },
  {
    path: 'outer-inner-resource-pn',
    loadChildren: () => import('./modules/outer-inner-resource-pn/outer-inner-resource-pn.module')
      .then(m => m.OuterInnerResourcePnModule)
  },
  {
    path: 'workflow-pn',
    loadChildren: () => import('./modules/workflow-pn/workflow-pn.module')
      .then(m => m.WorkflowPnModule)
  },
  {
    path: 'insight-dashboard-pn',
    loadChildren: () => import('./modules/insight-dashboard-pn/insight-dashboard-pn.module')
      .then(m => m.InsightDashboardPnModule)
  },
  {
    path: 'kanban-pn',
    loadChildren: () => import('./modules/kanban-pn/kanban-pn.module')
      .then(m => m.KanbanPnModule)
  },
// INSERT ROUTES HERE
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PluginsRouting {}

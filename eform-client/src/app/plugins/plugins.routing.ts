import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/common/guards';

export const routes: Routes = [
  // {
  //   path: 'items-planning-pn',
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import('./modules/items-planning-pn/items-planning-pn.module').then(
  //       (m) => m.ItemsPlanningPnModule
  //     ),
  // },
  // {
  //   path: 'backend-configuration-pn',
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import(
  //       './modules/backend-configuration-pn/backend-configuration-pn.module'
  //     ).then((m) => m.BackendConfigurationPnModule),
  // },
  // {
  //   path: 'time-planning-pn',
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import('./modules/time-planning-pn/time-planning-pn.module').then(
  //       (m) => m.TimePlanningPnModule
  //     ),
  // },
  // {
  //   path: 'inventory-pn',
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import('./modules/inventory-pn/inventory-pn.module').then(
  //       (m) => m.InventoryPnModule
  //     ),
  // },
  // {
  //   path: 'trash-inspection-pn',
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import('./modules/trash-inspection-pn/trash-inspection-pn.module').then(
  //       (m) => m.TrashInspectionPnModule
  //     ),
  // },
  // {
  //   path: 'work-orders-pn',
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import('./modules/workorders-pn/work-orders-pn.module').then(
  //       (m) => m.WorkOrdersPnModule
  //     ),
  // },
  // {
  //   path: 'outer-inner-resource-pn',
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import(
  //       './modules/outer-inner-resource-pn/outer-inner-resource-pn.module'
  //     ).then((m) => m.OuterInnerResourcePnModule),
  // },
  // {
  //   path: 'items-group-planning-pn',
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import(
  //       './modules/items-group-planning-pn/items-group-planning-pn.module'
  //     ).then((m) => m.ItemsGroupPlanningPnModule),
  // },
  // {
  //   path: 'workflow-pn',
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import('./modules/workflow-pn/workflow-pn.module').then(
  //       (m) => m.WorkflowPnModule
  //     ),
  // },
  // {
  //   path: 'installationchecking-pn',
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import(
  //       './modules/installationchecking-pn/installationchecking-pn.module'
  //     ).then((m) => m.InstallationCheckingPnModule),
  // },
  // {
  //   path: 'greate-belt-pn',
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import('./modules/greate-belt-pn/greate-belt-pn.module').then(
  //       (m) => m.GreateBeltPnModule
  //     ),
  // },
  // INSERT ROUTES HERE
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PluginsRouting {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard, AuthGuard, PermissionGuard } from 'src/app/common/guards';
import { ItemsPlanningPnLayoutComponent } from './layouts';
import {
  PlanningsContainerComponent,
  ItemsPlanningSettingsComponent,
  ReportContainerComponent,
  PlanningCasePageComponent,
  PlanningEditComponent,
  PlanningCreateComponent, PairingGridPageComponent,
} from './components';
import { ItemsPlanningPnClaims } from './enums';

export const routes: Routes = [
  {
    path: '',
    component: ItemsPlanningPnLayoutComponent,
    canActivate: [PermissionGuard],
    data: {
      requiredPermission: ItemsPlanningPnClaims.accessItemsPlanningPlugin,
    },
    children: [
      {
        path: 'plannings',
        canActivate: [PermissionGuard],
        data: {
          requiredPermission: ItemsPlanningPnClaims.getPlannings,
        },
        component: PlanningsContainerComponent,
      },
      {
        path: 'plannings/edit/:id',
        canActivate: [PermissionGuard],
        data: {
          requiredPermission: ItemsPlanningPnClaims.editPlanning,
        },
        component: PlanningEditComponent,
      },
      {
        path: 'plannings/create',
        canActivate: [AuthGuard],
        component: PlanningCreateComponent,
      },
      {
        path: 'planning-cases/:id',
        canActivate: [AuthGuard],
        component: PlanningCasePageComponent,
      },
      {
        path: 'settings',
        canActivate: [AdminGuard],
        component: ItemsPlanningSettingsComponent,
      },
      {
        path: 'reports',
        canActivate: [PermissionGuard],
        component: ReportContainerComponent,
        data: {
          requiredPermission: ItemsPlanningPnClaims.accessItemsPlanningPlugin,
        },
      },
      {
        path: 'reports/:dateFrom/:dateTo',
        canActivate: [PermissionGuard],
        component: ReportContainerComponent,
        data: {
          requiredPermission: ItemsPlanningPnClaims.accessItemsPlanningPlugin,
        },
      },
      {
        path: 'pairing',
        canActivate: [AuthGuard],
        component: PairingGridPageComponent,
      },
      {
        path: 'case',
        loadChildren: () =>
          import('./components/planning-case/planning-case.module').then(
            (m) => m.PlanningCaseModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsPlanningPnRouting {}

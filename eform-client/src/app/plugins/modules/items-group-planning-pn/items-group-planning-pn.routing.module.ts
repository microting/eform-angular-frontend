import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuard, AuthGuard, PermissionGuard} from 'src/app/common/guards';
import {ItemsGroupPlanningPnLayoutComponent} from './layouts';
import {
  ListsPageComponent,
  ItemsGroupPlanningSettingsComponent,
  ReportGeneratorContainerComponent,
  ListCasePageComponent,
  ListCaseResultPageComponent,
  ItemCaseUploadedDataComponent,
  ItemsGroupPlanningPnUnitImportComponent, ListEditComponent, ItemsListCreateComponent
} from './components';
import {ItemsGroupPlanningPnClaims} from './enums';

export const routes: Routes = [
  {
    path: '',
    component: ItemsGroupPlanningPnLayoutComponent,
    canActivate: [PermissionGuard],
    data: {requiredPermission: ItemsGroupPlanningPnClaims.accessItemsGroupPlanningPlugin},
    children: [
      {
        path: 'lists',
        canActivate: [AuthGuard],
        component: ListsPageComponent
      },
      {
        path: 'lists/edit/:id',
        canActivate: [AuthGuard],
        component: ListEditComponent
      },
      {
        path: 'lists/create',
        canActivate: [AuthGuard],
        component: ItemsListCreateComponent
      },
      {
        path: 'item-cases/:id',
        canActivate: [AuthGuard],
        component: ListCasePageComponent
      },
      {
        path: 'item-itemCase-results/:id',
        canActivate: [AuthGuard],
        component: ListCaseResultPageComponent
      },
      {
        path: 'settings',
        canActivate: [AdminGuard],
        component: ItemsGroupPlanningSettingsComponent
      },
      {
        path: 'reports',
        canActivate: [AdminGuard],
        component: ReportGeneratorContainerComponent
      },
      {
        path: 'item-cases/:id/:id',
        canActivate: [AdminGuard],
        component: ItemCaseUploadedDataComponent
      },
      {
        path: 'import',
        canActivate: [AdminGuard],
        component: ItemsGroupPlanningPnUnitImportComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsGroupPlanningPnRouting { }

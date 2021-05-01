import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuard, AuthGuard, PermissionGuard} from 'src/app/common/guards';
import {OuterInnerResourcePnLayoutComponent} from './layouts';
import {InnerResourcesPageComponent, OuterResourcesPageComponent, ReportGeneratorContainerComponent} from './components';
import {OuterInnerResourceSettingsComponent} from './components/outer-inner-resource-settings';
import {OuterInnerResourcePnClaims} from './enums';

export const routes: Routes = [
  {
    path: '',
    component: OuterInnerResourcePnLayoutComponent,
    canActivate: [PermissionGuard],
    data: {requiredPermission: OuterInnerResourcePnClaims.accessOuterInnerResourcePlugin},
    children: [
      {
        path: 'inner-resources',
        canActivate: [AuthGuard],
        component: InnerResourcesPageComponent
      },
      {
        path: 'outer-resources',
        canActivate: [AdminGuard],
        component: OuterResourcesPageComponent
      },
      {
        path: 'settings',
        canActivate: [AdminGuard],
        component: OuterInnerResourceSettingsComponent
      },
      {
        path: 'reports',
        canActivate: [AdminGuard],
        component: ReportGeneratorContainerComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OuterInnerResourcePnRouting {
}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuard, PermissionGuard} from 'src/app/common/guards';
import {TrashInspectionPnLayoutComponent} from './layouts';
import {
  FractionsPageComponent,
  FractionsPnImportComponent,
  InstallationsPageComponent,
  ProducerImportComponent,
  ProducerPageComponent,
  ReportPreviewTableContainerComponent,
  SegmentsPageComponent,
  TransporterImportComponent,
  TransporterPageComponent,
  TrashInspectionSettingsComponent,
  TrashInspectionsPageComponent,
} from './components';
import {TrashInspectionPnClaims} from './enums';

export const routes: Routes = [
  {
    path: '',
    component: TrashInspectionPnLayoutComponent,
    canActivate: [PermissionGuard],
    data: {
      requiredPermission: TrashInspectionPnClaims.accessTrashInspectionPlugin,
    },
    children: [
      {
        path: 'trash-inspections',
        canActivate: [PermissionGuard],
        component: TrashInspectionsPageComponent,
        data: {
          requiredPermission:
            TrashInspectionPnClaims.accessTrashInspectionPlugin,
        },
      },
      {
        path: 'installations',
        canActivate: [PermissionGuard],
        component: InstallationsPageComponent,
        data: {
          requiredPermission: TrashInspectionPnClaims.accessInstallation,
        },
      },
      {
        path: 'settings',
        canActivate: [AdminGuard],
        component: TrashInspectionSettingsComponent,
      },
      {
        path: 'fractions',
        canActivate: [PermissionGuard],
        component: FractionsPageComponent,
        data: { requiredPermission: TrashInspectionPnClaims.accessFraction },
      },
      {
        path: 'segments',
        canActivate: [PermissionGuard],
        component: SegmentsPageComponent,
        data: { requiredPermission: TrashInspectionPnClaims.accessSegment },
      },
      {
        path: 'importfraction',
        canActivate: [PermissionGuard],
        component: FractionsPnImportComponent,
        data: {
          requiredPermission:
            TrashInspectionPnClaims.accessTrashInspectionPlugin,
        },
      },
      {
        path: 'producers',
        canActivate: [PermissionGuard],
        component: ProducerPageComponent,
        data: { requiredPermission: TrashInspectionPnClaims.accessProducer },
      },
      {
        path: 'importproducers',
        canActivate: [PermissionGuard],
        component: ProducerImportComponent,
      },
      {
        path: 'transporters',
        canActivate: [PermissionGuard],
        component: TransporterPageComponent,
        data: { requiredPermission: TrashInspectionPnClaims.accessTransporter },
      },
      {
        path: 'importtransporters',
        canActivate: [PermissionGuard],
        component: TransporterImportComponent,
      },
      {
        path: 'reports',
        canActivate: [PermissionGuard],
        component: ReportPreviewTableContainerComponent,
        data: { requiredPermission: TrashInspectionPnClaims.accessReport },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrashInspectionPnRouting {}

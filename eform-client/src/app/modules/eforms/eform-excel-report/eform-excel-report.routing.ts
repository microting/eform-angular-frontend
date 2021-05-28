import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/common/guards';
import { EformExcelReportContainerComponent } from './components';

export const routes: Routes = [
  {
    path: ':eformId',
    canActivate: [AuthGuard],
    component: EformExcelReportContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EformExcelReportRouting {}

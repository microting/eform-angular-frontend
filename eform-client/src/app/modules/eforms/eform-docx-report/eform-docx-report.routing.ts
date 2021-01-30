import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/common/guards';
import { EformDocxReportContainerComponent } from './components';

export const routes: Routes = [
  {
    path: 'docx-report/:templateId',
    canActivate: [AuthGuard],
    component: EformDocxReportContainerComponent,
  },
  {
    path: 'docx-report/:dateFrom/:dateTo',
    canActivate: [AuthGuard],
    component: EformDocxReportContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EformDocxReportRouting {}

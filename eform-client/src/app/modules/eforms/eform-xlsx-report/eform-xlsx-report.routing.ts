import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/common/guards';
import { EformXlsxReportContainerComponent } from './components';

export const routes: Routes = [
  {
    path: ':eformId',
    canActivate: [AuthGuard],
    component: EformXlsxReportContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EformXlsxReportRouting {}

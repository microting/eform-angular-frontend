import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EformsPageComponent} from './components/index';

const routes: Routes = [
  {
    path: '',
    component: EformsPageComponent,
  },
  {
    path: 'report/:eformId',
    loadChildren: () => import('./eform-report/eform-report.module').then(m => m.EformReportModule),
    data: {
      eformId: 1
    },
  },
  {
    path: 'docx-report',
    loadChildren: () => import('./eform-docx-report/eform-docx-report.module').then(m => m.EformDocxReportModule)
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EformsRouting {
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EformsPageComponent } from './components/index';

const routes: Routes = [
  {
    path: '',
    component: EformsPageComponent,
  },
  {
    path: 'docx-report',
    loadChildren: () =>
      import('./eform-docx-report/eform-docx-report.module').then(
        (m) => m.EformDocxReportModule
      ),
  },
  {
    path: 'xlsx-report',
    loadChildren: () =>
      import('./eform-xlsx-report/eform-xlsx-report.module').then(
        (m) => m.EformXlsxReportModule
      ),
  },
  {
    path: 'visual-editor',
    loadChildren: () =>
      import('./eform-visual-editor/eform-visual-editor.module').then(
        (m) => m.EformVisualEditorModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EformsRouting {}
